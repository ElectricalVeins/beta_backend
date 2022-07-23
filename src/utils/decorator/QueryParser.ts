import { UsePipes } from '@nestjs/common';
import { BaseModel } from '../BaseModel';
import QueryPipe, { QueryPipeOpts } from '../QueryPipe';

export function QueryParser<M = typeof BaseModel>(model: M, opts: QueryPipeOpts): MethodDecorator {
  return UsePipes(new QueryPipe(model, opts));
}
