import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { RepositoryProvider } from 'src/repository/repository.provider';
import { BaseDomain } from '../base.domain';
import { SessionService } from 'src/resources/services/session.service';
import { Company } from 'src/models/company.model';

@Injectable()
export class CompanyDomain extends BaseDomain<Company> {
  constructor(
    @Inject(RepositoryProvider.USER)
    userRepository: Repository<Company>,
    public readonly sessionService: SessionService,
  ) {
    super(userRepository, sessionService);
  }

  protected getEntityName(): string {
    return 'COMPANY';
  }
}
