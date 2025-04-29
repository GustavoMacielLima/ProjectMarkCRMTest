import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { User } from '../../models/user.model';
import { RepositoryProvider } from 'src/repository/repository.provider';

@Injectable()
export class UserDomain {
  constructor(
    @Inject(RepositoryProvider.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: User): Promise<User> {
    const newUser = await this.userRepository.create({ ...createUserDto });
    return newUser;
  }

  async findAll(): Promise<Array<User>> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  async update(id: number, updateUserDto: User): Promise<User> {
    const user = await this.findOne(id);
    await user.update(updateUserDto);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
