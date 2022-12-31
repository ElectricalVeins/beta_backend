import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not as NotEquals,
} from 'typeorm';
import { BaseModel } from './BaseModel';
import { deleteFirstCharInString } from './helpers';

type RawQuery = {
  sort: string;
  filter: string;
  page: string;
  pageSize: string;
  responseFields: string;
  relations: string;
};

export type QueryPipeOpts = {
  fields: string[]; // permissible public fields to query
  relations?: string[];
};

export enum SearchOperators {
  EQUAL = '==',
  NOT_EQUAL = '!==',
  IN = '->', // vertical line separated values ("|")
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
}

export const MAX_PAGE_SIZE = 500;
export const DEFAULT_PAGE_SIZE = 50;

const operators: string[] = Object.values(SearchOperators);

@Injectable()
class QueryPipe<Model = typeof BaseModel> implements PipeTransform {
  private readonly model: Model;
  private readonly fields: string[];
  private readonly relations: string[];

  constructor(model: Model, opts: QueryPipeOpts) {
    const { fields = [], relations = [] } = opts;
    this.model = model;
    this.fields = fields;
    this.relations = relations;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'query') {
      return this.transformQuery(value as RawQuery);
    }
    return value;
  }

  transformQuery(rawQuery: RawQuery): FindManyOptions<unknown> {
    if (typeof rawQuery !== 'object' || !rawQuery) {
      throw new BadRequestException('Invalid query supplied');
    }
    const parsedQuery: any = {};
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      responseFields = '',
      relations: requestedRelations = '',
      sort,
      filter,
    } = rawQuery;
    if (sort && this.fields.length) {
      parsedQuery.order = this.convertSort(sort);
    }
    if (page || pageSize) {
      const { take, skip } = this.convertPagination({ page, pageSize });
      parsedQuery.take = take;
      parsedQuery.skip = skip;
    }
    if (filter && this.fields.length) {
      parsedQuery.where = this.convertFilter(filter);
    }
    // if ((requestedRelations && this.relations.length) || (responseFields && this.fields.length))
    const { relations, select } = this.handleResponseFields(responseFields, requestedRelations);
    parsedQuery.select = select;
    parsedQuery.relations = relations;

    parsedQuery.original = rawQuery;
    return parsedQuery;
  }

  private convertPagination(pagination: { page: string | number; pageSize: string | number }): {
    take: number;
    skip: number;
  } {
    const { page, pageSize } = pagination;
    const parsedSize = Number(pageSize || DEFAULT_PAGE_SIZE);
    const skipPage = Number(page || 1);
    if (Number.isNaN(parsedSize)) {
      throw new BadRequestException('Invalid pageSize supplied');
    }
    if (Number.isNaN(page)) {
      throw new BadRequestException('Invalid page supplied');
    }
    const take = Number(parsedSize) > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : parsedSize;
    return {
      take,
      skip: (skipPage - 1) * take,
    };
  }

  private getOperator(rawFilterValue): string {
    for (const operator of operators) {
      if (rawFilterValue.includes(operator)) {
        return operator;
      }
    }
  }

  private parseOperator(op: string, rawFilterValue: string): [string, any] {
    switch (op) {
      case SearchOperators.EQUAL: {
        const [key, value] = rawFilterValue.split(SearchOperators.EQUAL);
        if (value === '') {
          throw new BadRequestException(`Provide value for '${SearchOperators.EQUAL}' operator`);
        }
        return [key, value];
      }
      case SearchOperators.IN: {
        const [key, value] = rawFilterValue.split(SearchOperators.IN);
        // TODO: parse commas but inside square brackets
        const values = value.split('|');
        if (values.length === 0) {
          throw new BadRequestException(`Provide correct value for '${SearchOperators.IN}' operator`);
        }
        return [key, values];
      }
      case SearchOperators.GT: {
        const [key, value] = rawFilterValue.split(SearchOperators.GT);
        if (value === '') {
          throw new BadRequestException(`Provide value for '${SearchOperators.GT}' operator`);
        }
        return [key, MoreThan(value)];
      }
      case SearchOperators.GTE: {
        const [key, value] = rawFilterValue.split(SearchOperators.GTE);
        if (value === '') {
          throw new BadRequestException(`Provide value for '${SearchOperators.GTE}' operator`);
        }
        return [key, MoreThanOrEqual(value)];
      }
      case SearchOperators.LT: {
        const [key, value] = rawFilterValue.split(SearchOperators.LT);
        if (value === '') {
          throw new BadRequestException(`Provide value for '${SearchOperators.LT}' operator`);
        }
        return [key, LessThan(value)];
      }
      case SearchOperators.LTE: {
        const [key, value] = rawFilterValue.split(SearchOperators.LTE);
        if (value === '') {
          throw new BadRequestException(`Provide value for '${SearchOperators.LTE}' operator`);
        }
        return [key, LessThanOrEqual(value)];
      }
      case SearchOperators.NOT_EQUAL: {
        const [key, value] = rawFilterValue.split(SearchOperators.NOT_EQUAL);
        if (value === '') {
          throw new BadRequestException(`Provide value for '${SearchOperators.NOT_EQUAL}' operator`);
        }
        return [key, NotEquals(value)];
      }
      default: {
        throw new BadRequestException('Unknown operator supplied');
      }
    }
  }

  private convertFilter(rawFilter: string): FindOptionsWhere<unknown> {
    const rawFilterObject = this.separateRaw(rawFilter);
    const filters = rawFilterObject
      .map((rawFilterValue) => {
        const op = this.getOperator(rawFilterValue);
        const [field, value] = this.parseOperator(op, rawFilterValue);
        if (this.fields.includes(field)) {
          return { [field]: value };
        }
        return null;
      })
      .filter(Boolean);
    if (filters.length) {
      return filters;
    }
    return null;
  }

  private convertSort(sort: string): FindOptionsOrder<unknown> {
    return this.separateRaw(sort)
      .map((sortCriteria) => {
        if (sortCriteria === '') {
          return;
        }
        const isDesc = sortCriteria[0] === '-';
        const key = isDesc ? deleteFirstCharInString(sortCriteria) : sortCriteria;
        if (this.fields.includes(key)) {
          return {
            [key]: isDesc ? 'desc' : 'asc',
          };
        }
        return null;
      })
      .filter(Boolean)
      .reduce(
        (sortCriteria, criterias) => ({
          ...criterias,
          ...sortCriteria,
        }),
        {}
      );
  }

  private handleResponseFields(responseFields: string, requestedRelations: string): { select; relations } {
    const parsedRelationList = this.parseRelations(requestedRelations);
    const parsedFields = this.parseFields(responseFields);
    const relations = parsedRelationList.reduce(
      (relations, relationName) => ({
        ...relations,
        [relationName]: true,
      }),
      {}
    );
    return { relations, select: parsedFields };
  }

  private parseFields(responseFields: string): string[] {
    if (responseFields && !(responseFields === 'ALL')) {
      const requestedFields = this.separateRaw(responseFields);
      return requestedFields.filter((field) => this.fields.includes(field.toLowerCase()));
    }
    if (responseFields === 'ALL' || !responseFields) {
      return this.fields.map((v) => v);
    }
  }

  private parseRelations(requestedRelations: string): string[] {
    if (requestedRelations && !(requestedRelations === 'ALL' || requestedRelations === 'null')) {
      const requestedRelationsList = this.separateRaw(requestedRelations);
      return requestedRelationsList.filter((rel) => this.relations.includes(rel.toLowerCase()));
    }
    if (requestedRelations === 'ALL') {
      return this.relations.map((v) => v);
    }
    if (requestedRelations === 'null' || !requestedRelations) {
      return [];
    }
    throw new BadRequestException('Not Implemented: code = 0001');
  }

  private separateRaw(queryValue: string): string[] {
    return queryValue.split(',').map((v) => v.trim());
  }
}

export default QueryPipe;
