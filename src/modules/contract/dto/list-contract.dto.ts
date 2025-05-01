import {
  PaymentIntervalDayEnum,
  ProviderEnum,
} from 'src/models/contract.model';

export class ListContractDto {
  constructor(
    readonly provider: ProviderEnum,
    readonly rentValue: number,
    readonly debitTax: number,
    readonly pixTax: number,
    readonly creditTax: number,
    readonly creditLowTax: number,
    readonly creditHighTax: number,
    readonly paymentIntervalDay: PaymentIntervalDayEnum,
    readonly companyId: number,
  ) {}
}
