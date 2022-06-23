import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transform } from 'lodash';
import { BaseModel } from './BaseModel';

interface Response<T> {
  data: T;
}
const isPrimitive = (val) => Object(val) !== val;
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(this.createWrapper), map(this.mapper.bind(this)));
  }

  private createWrapper(data): any {
    return { data };
  }

  private mapper(data): any {
    /* TODO: refactor this. At least delete IGNORED FIELDS check. Create Resource class. */
    return transform(
      data,
      (json, prop, key) => {
        if (key === 'IGNORED_FIELDS') {
          return;
        }
        if (prop instanceof BaseModel) {
          return (json[key] = prop.toResource());
        }
        if (isPrimitive(prop) || prop instanceof Date) {
          return (json[key] = prop);
        }
        if ((typeof prop === 'object' && prop !== null) || Array.isArray(prop)) {
          return (json[key] = this.mapper(prop));
        }
        return (json[key] = prop);
      },
      {}
    );
  }
}
