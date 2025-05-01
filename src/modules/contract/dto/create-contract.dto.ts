import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
  PaymentIntervalDayEnum,
  ProviderEnum,
} from 'src/models/contract.model';

export class CreateContractDto {
  @IsEnum(ProviderEnum, { message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  provider: ProviderEnum;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_RENT_VALUE' })
  rentValue: number;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_DEBIT_TAX' })
  debitTax: number;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_PIX_TAX' })
  pixTax: number;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_CREDIT_TAX' })
  creditTax: number;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_CREDIT_LOW_TAX' })
  creditLowTax: number;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_CREDIT_HIGH_TAX' })
  creditHighTax: number;

  @IsEnum(PaymentIntervalDayEnum, {
    message: 'INVALID_PAYMENT_INTERVAL_DAY',
  })
  @IsNotEmpty({ message: 'REQUIRED_PAYMENT_INTERVAL_DAY' })
  paymentIntervalDay: PaymentIntervalDayEnum;

  @IsNumber()
  @IsNotEmpty({ message: 'REQUIRED_COMPANY_ID' })
  companyId: number;
}
