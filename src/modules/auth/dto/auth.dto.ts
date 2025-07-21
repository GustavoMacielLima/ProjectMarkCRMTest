import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  @IsNotEmpty({ message: 'REQUIRED_EMAIL' })
  email: string;
}
