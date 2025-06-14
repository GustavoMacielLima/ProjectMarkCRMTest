import { User } from 'src/models/user.model';
import { RepositoryProvider } from './repository.provider';
import { Company } from 'src/models/company.model';
import { Contract } from 'src/models/contract.model';
import { Pdv } from 'src/models/pdv.model';
import { Order } from 'src/models/order.model';
export const RepositoryAdapter = {
  useFactory: () => [
    {
      provide: RepositoryProvider.USER,
      useValue: User,
    },
    {
      provide: RepositoryProvider.COMPANY,
      useValue: Company,
    },
    {
      provide: RepositoryProvider.CONTRACT,
      useValue: Contract,
    },
    {
      provide: RepositoryProvider.PDV,
      useValue: Pdv,
    },
    {
      provide: RepositoryProvider.ORDER,
      useValue: Order,
    },
  ],
};

export const RepositoryModels: any[] = [User, Company, Contract, Pdv, Order];
