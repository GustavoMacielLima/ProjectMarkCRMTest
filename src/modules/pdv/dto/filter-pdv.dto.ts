import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ProviderEnum } from 'src/models/contract.model';
import { PdvStatusEnum } from 'src/models/pdv.model';
import { PaginationDto } from 'src/modules/pagination.dto';

export class FilterPdvDto {
  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;

  @IsOptional()
  @IsEnum(PdvStatusEnum, { message: 'INVALID_PROVIDER' })
  status?: PdvStatusEnum;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  pagination?: PaginationDto;
}
