import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ProviderEnum } from 'src/models/contract.model';
import { PdvStatusEnum } from 'src/models/pdv.model';

export class FilterPdvDto {
  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;

  @IsOptional()
  @IsEnum(PdvStatusEnum, { message: 'INVALID_PROVIDER' })
  status?: PdvStatusEnum;

  @IsOptional()
  @IsString()
  serialNumber?: PdvStatusEnum;
}
