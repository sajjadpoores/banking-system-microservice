import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsIranianNationalCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIranianNationalCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          if (!/^\d{10}$/.test(value)) return false;

          const check = parseInt(value[9], 10);
          const sum = value
            .substring(0, 9)
            .split('')
            .reduce(
              (acc, num, index) => acc + parseInt(num, 10) * (10 - index),
              0,
            );

          const remainder = sum % 11;
          if (remainder < 2) {
            return check === remainder;
          } else {
            return check === 11 - remainder;
          }
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Iranian National Code`;
        },
      },
    });
  };
}
