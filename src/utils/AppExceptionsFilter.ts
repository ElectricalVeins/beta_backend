import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EntityNotFoundError, TypeORMError } from 'typeorm';

type ResponseError = {
  message: string;
  statusCode: number;
  path: string;
  timestamp: string;
};

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const errorDetails: Partial<ResponseError> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      const response: any = exception.getResponse();
      errorDetails.message = typeof response === 'object' ? response?.message : response;
      errorDetails.statusCode = exception.getStatus();
    }

    if (exception instanceof TypeORMError) {
      if (exception instanceof EntityNotFoundError) {
        errorDetails.message = 'Resource not found';
        errorDetails.statusCode = 404;
      } else if (exception.message.includes('duplicate key value violates unique constraint')) {
        errorDetails.message = 'Email or login already exists';
        errorDetails.statusCode = 400;
      }
    }

    const responseBody: Partial<ResponseError> = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      ...errorDetails,
    };
    if (errorDetails.statusCode === 500) {
      console.error(exception);
      Logger.error(exception, 'Application Internal Error');
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
