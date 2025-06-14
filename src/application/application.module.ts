import { ConsoleLogger, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AuthApplication } from './auth/auth.application';
import { UserApplication } from './user/user.application';
import { VerificationService } from 'src/resources/services/verification.service';
import { EmailService } from 'src/resources/services/email.service';
import { CompanyApplication } from './company/company.application';
import { ContractApplication } from './contract/contract.application';
import { PdvApplication } from './pdv/pdv.application';
import { SessionService } from 'src/resources/services/session.service';
import { OrderApplication } from './order/order.application';

@Module({
  imports: [DomainModule],
  providers: [
    VerificationService,
    EmailService,
    SessionService,
    AuthApplication,
    UserApplication,
    ConsoleLogger,
    CompanyApplication,
    ContractApplication,
    PdvApplication,
    OrderApplication,
  ],
  exports: [
    AuthApplication,
    UserApplication,
    CompanyApplication,
    ContractApplication,
    PdvApplication,
    OrderApplication,
  ],
})
export class ApplicationModule {}
