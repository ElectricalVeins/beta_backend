import { UsePipes } from '@nestjs/common';
import { BaseModel } from '../BaseModel';
import QueryPipe from '../QueryPipe';

export function QueryParser<M = typeof BaseModel>(model: M, fields: string[]): MethodDecorator {
  return UsePipes(new QueryPipe(model, fields));
}
