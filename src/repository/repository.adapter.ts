import { User } from 'src/models/user.model';
import { RepositoryProvider } from './repository.provider';
import { Company } from 'src/models/company.model';
import { Contract } from 'src/models/contract.model';
import { Pdv } from 'src/models/pdv.model';

export const RepositoryAdapter = {
  useFactory: () => [
    {
      provide: RepositoryProvider.USER,
      useValue: User,
    },
  ],
};

export const RepositoryModels: any[] = [User, Company, Contract, Pdv];
