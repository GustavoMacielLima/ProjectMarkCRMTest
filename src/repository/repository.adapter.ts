import { User } from 'src/models/user.model';
import { RepositoryProvider } from './repository.provider';
import { Topic } from 'src/models/topic.model';
import { Resource } from 'src/models/resource.model';
export const RepositoryAdapter = {
  useFactory: () => [
    {
      provide: RepositoryProvider.USER,
      useValue: User,
    },
    {
      provide: RepositoryProvider.TOPIC,
      useValue: Topic,
    },
    {
      provide: RepositoryProvider.RESOURCE,
      useValue: Resource,
    },
  ],
};

export const RepositoryModels: any[] = [User, Topic, Resource];
