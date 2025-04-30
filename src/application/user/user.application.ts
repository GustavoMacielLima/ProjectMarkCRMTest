import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/domain/user/user.domain';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { VerificationService } from 'src/resources/services/verification.service';

@Injectable()
export class UserApplication {
  constructor(
    private readonly userDomain: UserDomain,
    private readonly verificationService: VerificationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User();

    Object.assign(newUser, createUserDto);
    const createdUser: User = await this.userDomain.create(newUser);

    // Gerar e enviar o código de verificação
    const verificationCode =
      await this.verificationService.sendVerificationCode(createdUser.email);

    createdUser.verificationCode = verificationCode;
    createdUser.codeCreatedAt = new Date();
    createdUser.isActive = false;
    await this.userDomain.update(createdUser.id, createdUser);

    return createdUser;
  }

  async findAll(): Promise<Array<User>> {
    const users: Array<User> = await this.userDomain.findAll();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user: User = await this.userDomain.findByStringId(id);
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    this.userDomain.update(user.id, user);
    return user;
  }

  async validate(id: string, validateCode: string): Promise<User> {
    const user: User = await this.findOne(id);

    if (user.verificationCode !== validateCode) {
      throw new NotFoundException('INVALID_CODE');
    }

    if (user.codeCreatedAt.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      throw new NotFoundException('CODE_EXPIRED');
    }

    user.isActive = true;
    this.userDomain.update(user.id, user);
    return user;
  }

  async remove(id: string) {
    const user: User = await this.findOne(id);
    this.userDomain.remove(user.id);
  }
}
