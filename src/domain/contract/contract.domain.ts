import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { RepositoryProvider } from 'src/repository/repository.provider';
import { BaseDomain } from '../base.domain';
import { SessionService } from 'src/resources/services/session.service';
import { Contract } from 'src/models/contract.model';

@Injectable()
export class ContractDomain extends BaseDomain<Contract> {
  constructor(
    @Inject(RepositoryProvider.CONTRACT)
    contractRepository: Repository<Contract>,
    public readonly sessionService: SessionService,
  ) {
    super(contractRepository, sessionService);
  }

  public async createNewContract(contract: Contract): Promise<Contract> {
    const allContracts = await this.findAll();
    for (const existingContract of allContracts) {
      existingContract.isCurrent = false;
      await this.update(existingContract.id, existingContract);
    }
    contract.isCurrent = true;
    contract.version = allContracts.length ? allContracts.length + 1 : 1;
    const newContract = await this.create(contract);
    return newContract;
  }

  protected getEntityName(): string {
    return 'CONTRACT';
  }
}
