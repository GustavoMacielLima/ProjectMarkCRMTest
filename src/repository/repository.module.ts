import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RepositoryAdapter, RepositoryModels } from './repository.adapter';

@Module({
  imports: [
    SequelizeModule.forFeature(RepositoryModels), // Registra o modelo User
  ],
  providers: [...RepositoryAdapter.useFactory()],
  exports: [...RepositoryAdapter.useFactory()],
})
export class RepositoryModule {}
