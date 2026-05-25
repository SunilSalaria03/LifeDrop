import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import {
  INDIAN_PHONE_VALIDATION_MESSAGE,
  isValidIndianMobilePhone,
} from '../phone/indian-phone';

export function IsIndianMobilePhone(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsIndianMobilePhone',
      target: object.constructor,
      propertyName,
      options: {
        message: INDIAN_PHONE_VALIDATION_MESSAGE,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false;
          }

          return isValidIndianMobilePhone(value);
        },
        defaultMessage(_args?: ValidationArguments) {
          return INDIAN_PHONE_VALIDATION_MESSAGE;
        },
      },
    });
  };
}
