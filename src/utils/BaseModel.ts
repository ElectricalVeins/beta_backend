import { BaseEntity } from 'typeorm';

export class BaseModel extends BaseEntity {
  public get type() {
    return this.constructor.name;
  }
}
