import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/domain/user/user.domain';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Injectable()
export class UserApplication {
  constructor(private readonly userDomain: UserDomain) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User();

    Object.assign(newUser, createUserDto);
    return await this.userDomain.create(newUser);
  }

  async findAll(): Promise<Array<User>> {
    const users: Array<User> = await this.userDomain.findAll();
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userDomain.findOne(id);
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
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
    this.userDomain.update(id, user);
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    this.userDomain.remove(user.id);
  }
}
