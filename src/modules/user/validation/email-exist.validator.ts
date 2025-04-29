import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserDomain } from 'src/domain/user/user.domain';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailExistValidator implements ValidatorConstraintInterface {
  constructor(private userDomain: UserDomain) {}

  async validate(value: any): Promise<boolean> {
    try {
      if (!value) {
        throw new BadRequestException('REQUIRED_EMAIL');
      }
      const userExists = await this.userDomain.findByEmail(value);

      return !userExists;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return true;
      }

      throw error;
    }
  }
}

export const EmailExist = (validationOptions: ValidationOptions) => {
  return (obj: unknown, property: string) => {
    registerDecorator({
      target: obj!.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: EmailExistValidator,
    });
  };
};
