import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { User } from '../../models/user.model';
import { RepositoryProvider } from 'src/repository/repository.provider';
import { BaseDomain } from '../base.domain';
import { SessionService } from 'src/resources/services/session.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserDomain extends BaseDomain<User> {
  constructor(
    @Inject(RepositoryProvider.USER)
    userRepository: Repository<User>,
    public readonly sessionService: SessionService,
  ) {
    super(userRepository, sessionService);
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  protected getEntityName(): string {
    return 'USER';
  }
}
