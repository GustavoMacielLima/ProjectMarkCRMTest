import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyDomain } from 'src/domain/company/company.domain';
import { ContractDomain } from 'src/domain/contract/contract.domain';
import { PdvDomain } from 'src/domain/pdv/pdv.domain';
import { Company } from 'src/models/company.model';
import { Contract } from 'src/models/contract.model';
import { Pdv } from 'src/models/pdv.model';
import { CreatePdvDto } from 'src/modules/pdv/dto/create-pdv.dto';
import { UpdatePdvDto } from 'src/modules/pdv/dto/update-pdv.dto';

@Injectable()
export class PdvApplication {
  constructor(
    private readonly pdvDomain: PdvDomain,
    private readonly companyDomain: CompanyDomain,
    private readonly contractDomain: ContractDomain,
  ) {}

  async create(createPdvDto: CreatePdvDto): Promise<Pdv> {
    const newPdv: Pdv = new Pdv();
    const company: Company = await this.companyDomain.findByStringId(
      createPdvDto.companyId,
    );

    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }

    const contract: Contract = await this.contractDomain.findOne({
      companyId: company.id,
      provider: createPdvDto.provider,
      isCurrent: true,
    });

    if (!contract) {
      throw new NotFoundException('CONTRACT_NOT_FOUND');
    }

    Object.assign(newPdv, createPdvDto);
    newPdv.companyId = company.id;
    newPdv.contractId = contract.id;
    const createdPdv: Pdv = await this.pdvDomain.createNewPdv(newPdv);

    return createdPdv;
  }

  async findAll(): Promise<Array<Pdv>> {
    const pdvs: Array<Pdv> = await this.pdvDomain.findAll();
    return pdvs;
  }

  async findOne(id: string): Promise<Pdv> {
    const pdv: Pdv = await this.pdvDomain.findByStringId(id);
    if (!pdv) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return pdv;
  }

  async update(id: string, updatePdvDto: UpdatePdvDto): Promise<Pdv> {
    const pdv = await this.findOne(id);
    Object.assign(pdv, updatePdvDto);
    this.pdvDomain.update(pdv.id, pdv);
    return pdv;
  }

  async remove(id: string) {
    const pdv: Pdv = await this.findOne(id);
    this.pdvDomain.remove(pdv.id);
  }
}
