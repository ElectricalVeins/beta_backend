import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { TypeORMError } from 'typeorm';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const errorDetails: Record<string, unknown> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof HttpException) {
      errorDetails.message = exception.getResponse();
      errorDetails.statusCode = exception.getStatus();
    }

    if (exception instanceof TypeORMError) {
      if (exception.message.includes('duplicate key value violates unique constraint')) {
        errorDetails.message = 'Email already exists';
        errorDetails.statusCode = 400;
      }
    }

    const responseBody: any = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      ...errorDetails,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode as number);
  }
}
