import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/domain/user/user.domain';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { SessionService } from 'src/resources/services/session.service';

@Injectable()
export class UserApplication {
  constructor(
    private readonly userDomain: UserDomain,
    private readonly sessionService: SessionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User();

    Object.assign(newUser, createUserDto);

    const createdUser: User = await this.userDomain.create(newUser);

    return createdUser;
  }

  async findAll(): Promise<Array<User>> {
    const users: Array<User> = await this.userDomain.findAll();
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userDomain.findByPk(id);
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  async myself(): Promise<User> {
    const loggedUser: User = this.sessionService.getUser();
    return loggedUser;
  }

  async findByEmail(email: string): Promise<User> {
    const user: User = await this.userDomain.findByEmail(email);
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    await this.userDomain.update(user.id, user);
    return user;
  }

  async remove(id: number) {
    const user: User = await this.findOne(id);
    await this.userDomain.remove(user.id);
  }
}
