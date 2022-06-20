import { BaseEntity } from 'typeorm';

export class BaseModel extends BaseEntity {
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
}
