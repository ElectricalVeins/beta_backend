import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm';

type RawQuery = {
  sort: string;
  filter: string;
  page: string;
  pageSize: string;
  responseFields: string;
  relations: string;
};

export enum SearchOperators {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  IN = '->',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
}

// FindManyOptions, FindOptionsWhere, FindOptionsOrder

const MAX_PAGE_SIZE = 500;
const DEFAULT_PAGE_SIZE = 50;

@Injectable()
class QueryPipe implements PipeTransform {
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
    const { sort, page, pageSize, filter, responseFields, relations } = rawQuery;
    if (sort) {
      parsedQuery.sort = this.convertSort(sort);
    }
    if (page || pageSize) {
      const { take, skip } = this.convertPagination({ page, pageSize });
      parsedQuery.take = take;
      parsedQuery.skip = skip;
    }
    if (filter) {
      parsedQuery.where = this.convertFilter(filter);
    }
    if (relations || responseFields) {
      // TODO: parse select fields and joins
    }
    parsedQuery.original = rawQuery;
    return parsedQuery;
  }

  private convertPagination(pagination: { page: string; pageSize: string }): { take: number; skip: number } {
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

  private convertFilter(rawFilter: string): FindOptionsWhere<unknown> {
    const rawFilterObject = this.separateRaw(rawFilter);
    const operators: string[] = Object.values(SearchOperators);
    // TODO: parse filter | refactor code
    return rawFilterObject.map((rawFilterValue) => {
      let op = '';
      for (const operator of operators) {
        if (rawFilterValue.includes(operator)) {
          op = operator;
          break;
        }
      }
      switch (op) {
        case SearchOperators.EQUAL: {
          const [key, value] = rawFilterValue.split(SearchOperators.EQUAL);
          if (value === '') {
            throw new BadRequestException(`Provider value for '${SearchOperators.EQUAL}' operator`);
          }
          return { [key]: value };
        }
        case SearchOperators.IN: {
          const [key, value] = rawFilterValue.split(SearchOperators.IN);
          // TODO: parse commas but inside square brackets
          const values = value.split(',');
          if (values.length === 0) {
            throw new BadRequestException(`Provider correct value for '${SearchOperators.IN}' operator`);
          }
          return { [key]: [...values] };
        }
        case SearchOperators.GT: {
          break;
        }
        case SearchOperators.GTE: {
          break;
        }
        case SearchOperators.LT: {
          break;
        }
        case SearchOperators.LTE: {
          break;
        }
        case SearchOperators.NOT_EQUAL: {
          break;
        }
        default: {
        }
      }
    });
  }

  private convertSort(sort: string): FindOptionsOrder<unknown> {
    return this.separateRaw(sort)
      .map((sortCriteria) => {
        if (sortCriteria === '') {
          return;
        }
        const isDesc = sortCriteria[0] === '-';
        return {
          [isDesc ? sortCriteria.slice(1) : sortCriteria]: isDesc ? 'desc' : 'asc',
        };
      })
      .filter(Boolean);
  }

  private separateRaw(queryValue: string): string[] {
    return queryValue.split(',');
  }
}

export default QueryPipe;
