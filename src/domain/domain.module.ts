import { Module } from '@nestjs/common';
import { UserDomain } from './user/user.domain';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [UserDomain],
  exports: [UserDomain],
})
export class DomainModule {}
