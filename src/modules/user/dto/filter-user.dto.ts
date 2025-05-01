import { IsOptional, IsString, IsEmail } from 'class-validator';
import { PaginationDto } from 'src/modules/pagination.dto';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  pagination?: PaginationDto;
}
