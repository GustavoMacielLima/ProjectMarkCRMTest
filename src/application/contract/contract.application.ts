import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyDomain } from 'src/domain/company/company.domain';
import { ContractDomain } from 'src/domain/contract/contract.domain';
import { Company } from 'src/models/company.model';
import { Contract } from 'src/models/contract.model';
import { CreateContractDto } from 'src/modules/contract/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contract/dto/update-contract.dto';

@Injectable()
export class ContractApplication {
  constructor(
    private readonly contractDomain: ContractDomain,
    private companyDomain: CompanyDomain,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const newContract: Contract = new Contract();
    const company: Company = await this.companyDomain.findByStringId(
      createContractDto.companyId,
    );

    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }

    Object.assign(newContract, createContractDto);
    newContract.companyId = company.id;
    const createdContract: Contract =
      await this.contractDomain.createNewContract(newContract);

    return createdContract;
  }

  async findAll(): Promise<Array<Contract>> {
    const contracts: Array<Contract> = await this.contractDomain.findAll({
      isCurrent: true,
    });
    return contracts;
  }

  async findOne(id: string): Promise<Contract> {
    const contract: Contract = await this.contractDomain.findByStringId(id);
    if (!contract) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    const newContract: Contract = new Contract();
    const contract = await this.findOne(id);
    if (!contract) {
      throw new NotFoundException('CONTRACT_NOT_FOUND');
    }
    newContract.provider = contract.provider;
    newContract.rentValue = contract.rentValue;
    newContract.debitTax = contract.debitTax;
    newContract.pixTax = contract.pixTax;
    newContract.creditTax = contract.creditTax;
    newContract.creditLowTax = contract.creditLowTax;
    newContract.creditHighTax = contract.creditHighTax;
    newContract.paymentIntervalDay = contract.paymentIntervalDay;
    newContract.companyId = contract.companyId;
    Object.assign(newContract, updateContractDto);
    await this.contractDomain.createNewContract(newContract);
    return newContract;
  }

  async remove(id: string) {
    const contract: Contract = await this.findOne(id);
    this.contractDomain.remove(contract.id);
  }
}
