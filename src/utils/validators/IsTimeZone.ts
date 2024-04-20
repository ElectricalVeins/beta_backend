import { toZonedTime } from 'date-fns-tz';
import { registerDecorator, ValidationOptions } from 'class-validator';

// TODO: check logic
export function IsTimeZone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsTimeZone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const d = toZonedTime(new Date(), value);
          console.log(`Validating timezone: ${value}. Result: ${d}`);
          return Boolean(d);
        },
      },
    });
  };
}
