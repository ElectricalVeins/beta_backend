import { UsePipes } from '@nestjs/common';
import { BaseModel } from '../BaseModel';
import QueryPipe from '../QueryPipe';
import { API_PROPERTIES } from './ApiProperty';
import { API_RELATIONS } from './ApiRelation';

export function QueryParser<M = typeof BaseModel>(model: M): MethodDecorator {
  return UsePipes(
    new QueryPipe(model, {
      relations: model['prototype'][API_RELATIONS],
      fields: model['prototype'][API_PROPERTIES],
    })
  );
}
