import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ProviderEnum } from 'src/models/contract.model';
import { PaymentMethodEnum } from 'src/models/order.model';
import { PaginationDto } from 'src/modules/pagination.dto';

export class FilterOrderDto {
  @IsOptional()
  @IsEnum(ProviderEnum, { message: 'INVALID_PROVIDER' })
  provider?: ProviderEnum;

  @IsOptional()
  @IsEnum(PaymentMethodEnum, { message: 'INVALID_PAYMENT_METHOD' })
  paymentMethod?: PaymentMethodEnum;

  @IsOptional()
  @IsNumber()
  startAmount?: number;

  @IsOptional()
  @IsNumber()
  endAmount?: number;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  contractId?: string;

  @IsOptional()
  @IsDateString()
  startCompletedAt?: Date;

  @IsOptional()
  @IsDateString()
  endCompletedAt?: Date;

  @IsOptional()
  pagination?: PaginationDto;
}
