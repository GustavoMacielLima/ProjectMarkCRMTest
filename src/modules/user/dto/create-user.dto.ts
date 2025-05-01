import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../models/user.model';

export class CreateUserDto {
  @IsString({ message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  name: string;

  @IsString({ message: 'INVALID_SURNAME' })
  @IsNotEmpty({ message: 'REQUIRED_SURNAME' })
  surname: string;

  @IsString({ message: 'INVALID_FULL_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_FULL_NAME' })
  fullName: string;

  @IsOptional()
  @IsString({ message: 'INVALID_PHONE' })
  phone: string;

  @IsString({ message: 'INVALID_IDENTIFIER' })
  @IsNotEmpty({ message: 'REQUIRED_IDENTIFIER' })
  identifier: string;

  @IsNotEmpty({ message: 'REQUIRED_ROLE' })
  @IsEnum(UserRole, { message: 'INVALID_ROLE' })
  role: UserRole;

  @IsNotEmpty({ message: 'REQUIRED_EMAIL' })
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  email: string;

  @MinLength(6, { message: 'INVALID_MIN_PASSWORD' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,30}$/gm, {
    message: 'INVALID_PASSWORD',
  })
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: 'REQUIRED_COMPANY_ID' })
  companyId?: number;
}
