import { ConsoleLogger, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AuthApplication } from './auth/auth.application';
import { UserApplication } from './user/user.application';
import { VerificationService } from 'src/resources/services/verification.service';
import { EmailService } from 'src/resources/services/email.service';
import { SessionService } from 'src/resources/services/session.service';
import { TopicApplication } from './topic/topic.application';
import { ResourceApplication } from './resource/resource.application';

@Module({
  imports: [DomainModule],
  providers: [
    VerificationService,
    EmailService,
    SessionService,
    AuthApplication,
    UserApplication,
    ConsoleLogger,
    ResourceApplication,
    TopicApplication,
  ],
  exports: [
    AuthApplication,
    UserApplication,
    ResourceApplication,
    TopicApplication,
  ],
})
export class ApplicationModule {}
