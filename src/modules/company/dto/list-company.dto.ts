export class ListCompanyDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly socialName: string,
    readonly revanueRecord: string,
    readonly phone: string,
    readonly paymentMethod: string,
    readonly mainContact: string,
    readonly email: string,
    readonly address: string,
    readonly isActive: boolean,
  ) {}
}
