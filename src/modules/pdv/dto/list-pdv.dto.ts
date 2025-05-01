import { PdvStatusEnum, ProviderEnum } from 'src/models/pdv.model';

export class ListPdvDto {
  constructor(
    readonly provider: ProviderEnum,
    readonly status: PdvStatusEnum,
    readonly serialNumber: string,
    readonly contractId: number,
    readonly companyId: number,
  ) {}
}
