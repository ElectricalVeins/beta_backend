import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export function addFilter(filter: string | undefined, field: string, value: any): string {
  const isFilterExists = filter?.length;
  return `${isFilterExists ? `${filter},` : ''}${field}==${value}`;
}

export class OnlyOwnResourceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.query.filter = addFilter(req.query.filter, 'userId', req.user.userid);
    return next.handle();
  }
}
