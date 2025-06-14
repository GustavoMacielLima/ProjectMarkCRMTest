import { PaymentMethodEnum, CreditFlagEnum } from 'src/models/order.model';
import { ProviderEnum } from 'src/models/pdv.model';
export class ListOrderDto {
  constructor(
    readonly id: string,
    readonly provider: ProviderEnum,
    readonly paymentMethod: PaymentMethodEnum,
    readonly installment: number,
    readonly creditFlag: CreditFlagEnum,
    readonly amount: number,
    readonly completedAt: Date,
    readonly contractId: number,
    readonly companyId: number,
  ) {}
}
