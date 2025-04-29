import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { EmailExist } from '../validation/email-exist.validator';
import { GenderEnum } from '../../../db/entities/user/enum/gender.enum';
import { NacionalityEnum } from '../../../db/entities/user/enum/nacionality.enum';
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
  @EmailExist({ message: 'EMAIL_ALREADY_EXISTS' })
  email: string;

  @MinLength(6, { message: 'INVALID_MIN_PASSWORD' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,30}$/gm, {
    message: 'INVALID_PASSWORD',
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'INVALID_SOCIAL_NAME' })
  socialName: string;

  @IsNotEmpty({ message: 'REQUIRED_GENDER' })
  @IsEnum(GenderEnum, { message: 'INVALID_GENDER' })
  gender: GenderEnum;

  @IsNotEmpty({ message: 'REQUIRED_BIRTHDAY' })
  @IsDateString(undefined, { message: 'INVALID_DATE' })
  birthday: string;

  @IsNotEmpty({ message: 'REQUIRED_PRACTICE_BEGIN' })
  @IsDateString(undefined, { message: 'INVALID_DATE' })
  practiceBegin: string;

  @IsNotEmpty({ message: 'REQUIRED_NATIONALITY' })
  @IsEnum(NacionalityEnum, { message: 'INVALID_NATIONALITY' })
  nationality: NacionalityEnum;

  @IsOptional()
  @IsNotEmpty({ message: 'REQUIRED_COMPANY_ID' })
  companyId?: number;
}
