import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';
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
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  pagination?: PaginationDto;
}
