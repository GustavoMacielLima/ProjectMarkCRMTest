import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../../models/user.model';

export class CreateUserDto {
  @IsString({ message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  name: string;

  @IsNotEmpty({ message: 'REQUIRED_ROLE' })
  @IsEnum(UserRole, { message: 'INVALID_ROLE' })
  role: UserRole;

  @IsNotEmpty({ message: 'REQUIRED_EMAIL' })
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  email: string;
}
