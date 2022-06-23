import { BaseEntity } from 'typeorm';

export class BaseModel extends BaseEntity {
  protected readonly IGNORED_FIELDS: string[] = [];

  public get type(): string {
    return this.constructor.name;
  }

  public static build<T extends BaseModel>(draft: T, data: object): T {
    for (const [key, value] of Object.entries(data)) {
      if (data.hasOwnProperty(key)) {
        draft[key] = value;
      }
    }
    return draft;
  }

  toResource<T>(): T {
    const json: object = {};
    // TODO: refactor to functional style
    for (const [key, value] of Object.entries(this)) {
      if (this.hasOwnProperty(key)) {
        if (this.IGNORED_FIELDS.includes(key) || key === 'IGNORED_FIELDS') {
          continue;
        }
        // TODO: get rid of this: make IGNORED_FIELDS invisible
        if (this[key] instanceof BaseModel) {
          json[key] = this[key].toResource();
          continue;
        }
        json[key] = value;
      }
    }
    return json as unknown as T;
  }
}
