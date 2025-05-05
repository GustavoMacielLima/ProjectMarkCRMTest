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
      if (existingContract.provider !== contract.provider) continue;
      this.setOldestVersions(existingContract);
    }
    contract.isCurrent = true;
    const contractByProvider: Array<Contract> = allContracts.filter(
      (contractProvider: Contract) =>
        contractProvider.provider === contract.provider,
    );
    contract.version = contractByProvider.length
      ? contractByProvider.length + 1
      : 1;
    const newContract = await this.create(contract);
    return newContract;
  }

  private async setOldestVersions(contract: Contract): Promise<void> {
    contract.isCurrent = false;
    console.log('set old version');
    console.log(contract);
    await this.update(contract.id, contract);
  }

  protected getEntityName(): string {
    return 'CONTRACT';
  }
}
