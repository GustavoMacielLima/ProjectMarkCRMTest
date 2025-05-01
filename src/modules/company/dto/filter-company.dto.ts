import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { ProviderEnum } from 'src/models/contract.model';
import { PaginationDto } from 'src/modules/pagination.dto';

export class FilterCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  socialName?: string;

  @IsOptional()
  @IsEmail()
  revanueRecord?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;

  @IsOptional()
  pagination?: PaginationDto;
}
