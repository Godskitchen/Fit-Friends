import { Role } from '@libs/shared/app-types';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

type ObjWithRoleProp = { role: Role };

@ValidatorConstraint({ async: true })
export class IsRedundantConstraint implements ValidatorConstraintInterface {
  async validate(_value: unknown, { object, property }: ValidationArguments) {
    const obj = object as ObjWithRoleProp;
    return (
      (obj.role === Role.User && property === 'userProfile') ||
      (obj.role === Role.Trainer && property === 'trainerProfile')
    );
  }

  defaultMessage({ object }: ValidationArguments) {
    const obj = object as ObjWithRoleProp;
    return `$property: Для роли ${obj.role} данное поле запрещено.`;
  }
}

export function IsRedundant(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isRedundant',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsRedundantConstraint,
    });
  };
}
