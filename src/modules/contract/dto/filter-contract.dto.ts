import { IsOptional, IsEnum } from 'class-validator';
import { ProviderEnum } from 'src/models/contract.model';

export class FilterContractDto {
  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;
}
