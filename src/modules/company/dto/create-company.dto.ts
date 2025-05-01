import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  name: string;

  @IsString({ message: 'INVALID_SOCIAL_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_SOCIAL_NAME' })
  socialName: string;

  @IsString({ message: 'INVALID_REVENUE_RECORD' })
  @IsNotEmpty({ message: 'REQUIRED_REVENUE_RECORD' })
  @Length(14, 14, {
    message: 'INVALID_REVENUE_RECORD_LENGTH',
  })
  @Matches(/^\d{14}$/, {
    message: 'INVALID_REVENUE_RECORD_FORMAT',
  })
  revanueRecord: string;

  @IsOptional()
  @IsString({ message: 'INVALID_PHONE' })
  phone: string;

  @IsString({ message: 'INVALID_PAYMENT_METHOD' })
  @IsNotEmpty({ message: 'REQUIRED_PAYMENT_METHOD' })
  paymentMethod: string;

  @IsString({ message: 'INVALID_MAIN_CONTACT' })
  @IsNotEmpty({ message: 'REQUIRED_MAIN_CONTACT' })
  mainContact: string;

  @IsNotEmpty({ message: 'REQUIRED_EMAIL' })
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  email: string;

  @IsString({ message: 'INVALID_ADDRESS' })
  @IsNotEmpty({ message: 'REQUIRED_ADDRESS' })
  address: string;
}
