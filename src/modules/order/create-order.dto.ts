import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethodEnum, CreditFlagEnum } from 'src/models/order.model';
import { ProviderEnum } from 'src/models/pdv.model';

export class CreateOrderDto {
  @IsEnum(ProviderEnum, { message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  provider: ProviderEnum;

  @IsEnum(PaymentMethodEnum, { message: 'INVALID_PAYMENT_METHOD' })
  @IsNotEmpty({ message: 'REQUIRED_PAYMENT_METHOD' })
  paymentMethod: PaymentMethodEnum;

  @IsNotEmpty({ message: 'REQUIRED_INSTALLMENT' })
  installment: number;

  @IsEnum(CreditFlagEnum, { message: 'INVALID_CREDIT_FLAG' })
  @IsNotEmpty({ message: 'REQUIRED_CREDIT_FLAG' })
  creditFlag: CreditFlagEnum;

  @IsNotEmpty({ message: 'REQUIRED_AMOUNT' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'REQUIRED_CONTRACT_ID' })
  contractId: string;

  @IsString()
  @IsNotEmpty({ message: 'REQUIRED_COMPANY_ID' })
  companyId: string;
}
