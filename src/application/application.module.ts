import { ConsoleLogger, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AuthApplication } from './auth/auth.application';
import { UserApplication } from './user/user.application';
import { VerificationService } from 'src/resources/services/verification.service';
import { EmailService } from 'src/resources/services/email.service';
import { CompanyApplication } from './company/company.application';
import { ContractApplication } from './contract/contract.application';
import { PdvApplication } from './pdv/pdv.application';

@Module({
  imports: [DomainModule],
  providers: [
    VerificationService,
    EmailService,
    AuthApplication,
    UserApplication,
    ConsoleLogger,
    CompanyApplication,
    ContractApplication,
    PdvApplication,
  ],
  exports: [
    AuthApplication,
    UserApplication,
    CompanyApplication,
    ContractApplication,
    PdvApplication,
  ],
})
export class ApplicationModule {}
