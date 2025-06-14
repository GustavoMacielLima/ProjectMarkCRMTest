import { Module } from '@nestjs/common';
import { UserDomain } from './user/user.domain';
import { RepositoryModule } from 'src/repository/repository.module';
import { SessionService } from 'src/resources/services/session.service';
import { CompanyDomain } from './company/company.domain';
import { ContractDomain } from './contract/contract.domain';
import { PdvDomain } from './pdv/pdv.domain';
import { OrderDomain } from './order/order.domain';

@Module({
  imports: [RepositoryModule],
  providers: [
    SessionService,
    UserDomain,
    CompanyDomain,
    ContractDomain,
    PdvDomain,
    OrderDomain,
  ],
  exports: [UserDomain, CompanyDomain, ContractDomain, PdvDomain, OrderDomain],
})
export class DomainModule {}
