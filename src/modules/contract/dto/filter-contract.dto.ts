import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ProviderEnum } from 'src/models/contract.model';
import { PaginationDto } from 'src/modules/pagination.dto';

export class FilterContractDto {
  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  pagination?: PaginationDto;
}
