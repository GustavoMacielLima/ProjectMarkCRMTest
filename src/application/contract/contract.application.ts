import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractDomain } from 'src/domain/contract/contract.domain';
import { Contract } from 'src/models/contract.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Injectable()
export class ContractApplication {
  constructor(private readonly contractDomain: ContractDomain) {}

  async create(createContractDto: CreateUserDto): Promise<Contract> {
    const newContract: Contract = new Contract();

    Object.assign(newContract, createContractDto);
    const createdContract: Contract =
      await this.contractDomain.createNewContract(newContract);

    return createdContract;
  }

  async findAll(): Promise<Array<Contract>> {
    const contracts: Array<Contract> = await this.contractDomain.findAll();
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
    updateContractDto: UpdateUserDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id);
    Object.assign(contract, updateContractDto);
    this.contractDomain.update(contract.id, contract);
    return contract;
  }

  async remove(id: string) {
    const contract: Contract = await this.findOne(id);
    this.contractDomain.remove(contract.id);
  }
}
