import { ConsoleLogger, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AuthApplication } from './auth/auth.application';
import { UserApplication } from './user/user.application';
import { VerificationService } from 'src/resources/services/verification.service';
import { EmailService } from 'src/resources/services/email.service';

@Module({
  imports: [DomainModule],
  providers: [
    VerificationService,
    EmailService,
    AuthApplication,
    UserApplication,
    ConsoleLogger,
  ],
  exports: [AuthApplication, UserApplication],
})
export class ApplicationModule {}
