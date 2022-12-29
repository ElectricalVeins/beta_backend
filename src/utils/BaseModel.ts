import { BaseEntity } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

export abstract class BaseModel extends BaseEntity {
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

  mutate(updateDto: object): void {
    Object.keys(updateDto).forEach((key) => {
      this[key] = updateDto[key] || this[key];
    });
  }

  cleanUnderscoresProperties(record: object): void {
    // Remove all double underscores `__` from all properties when serializing object
    Object.entries(record).forEach(([key, value]) => {
      if (key.startsWith('__') && key.endsWith('__')) {
        const newKey = key.substring(2, key.length - 2);
        record[newKey] = record[key];
        record[key] = undefined;
      } else if (typeof value === 'object' && value !== null) {
        this.cleanUnderscoresProperties(value);
      }
    });
  }

  toJSON(): object {
    /* Possible way to exclude `__tier__` field from response: https://github.com/typeorm/typeorm/issues/2836#issuecomment-1099808057 */
    const json = instanceToPlain(this);
    if (json !== null) {
      this.cleanUnderscoresProperties(json);
    }
    return json;
  }
}
