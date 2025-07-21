import { Module } from '@nestjs/common';
import { UserDomain } from './user/user.domain';
import { RepositoryModule } from 'src/repository/repository.module';
import { SessionService } from 'src/resources/services/session.service';
import { ResourceDomain } from './resource/resource.domain';
import { TopicDomain } from './topic/topic.domain';

@Module({
  imports: [RepositoryModule],
  providers: [SessionService, UserDomain, TopicDomain, ResourceDomain],
  exports: [UserDomain, TopicDomain, ResourceDomain],
})
export class DomainModule {}
