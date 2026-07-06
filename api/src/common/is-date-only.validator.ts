import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';
import { isValidDateOnly } from './date-utils';

export function IsDateOnly(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isDateOnly',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} deve ser uma data válida no formato YYYY-MM-DD.`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          return isValidDateOnly(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} deve ser uma data válida no formato YYYY-MM-DD.`;
        },
      },
    });
  };
}
