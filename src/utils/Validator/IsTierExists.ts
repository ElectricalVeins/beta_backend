import { registerDecorator, ValidationOptions } from 'class-validator';
import { EntityTarget } from 'typeorm';
import { config } from '../../config/configuration-expert';
import { BaseModel } from '../BaseModel';
// TODO: check logic. check if need this decorator
function IsEntityExist(entity: EntityTarget<BaseModel>, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        async validate(value: string): Promise<boolean> {
          const record = await config.dataSource.getRepository(entity).findOneBy({ [propertyName]: value });
          return !record;
        },
      },
    });
  };
}
