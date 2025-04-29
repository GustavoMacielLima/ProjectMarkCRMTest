import { ConsoleLogger, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AuthApplication } from './auth/auth.application';
import { UserApplication } from './user/user.application';

@Module({
  imports: [DomainModule],
  providers: [AuthApplication, UserApplication, ConsoleLogger],
  exports: [AuthApplication, UserApplication],
})
export class ApplicationModule {}
