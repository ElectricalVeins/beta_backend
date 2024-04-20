import { registerDecorator, ValidationOptions } from 'class-validator';
import { EntityTarget } from 'typeorm';
import { BaseModel } from '../BaseModel';

// TODO: check logic. check if need this decorator
function IsEntityExist(
  entity: EntityTarget<BaseModel>,
  validationOptions?: ValidationOptions
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        async validate(value: string): Promise<boolean> {
          /* TODO: delete config.dataSource */
          // const record = await config.dataSource.getRepository(entity).findOneBy({ [propertyName]: value });
          // return !record;
          return true;
        },
      },
    });
  };
}
