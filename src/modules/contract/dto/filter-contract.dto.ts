import { IsOptional, IsEnum, IsString } from 'class-validator';
import {
  PaymentIntervalDayEnum,
  ProviderEnum,
} from 'src/models/contract.model';
import { PaginationDto } from 'src/modules/pagination.dto';

export class FilterContractDto {
  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;

  @IsOptional()
  @IsEnum(PaymentIntervalDayEnum, { message: 'INVALID_INTERVAL_DAY' })
  paymentIntervalDay?: PaymentIntervalDayEnum;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  pagination?: PaginationDto;
}
