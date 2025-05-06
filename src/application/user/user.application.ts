import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { WhereOptions } from 'sequelize';
import { Pagination } from 'src/domain/base.domain';
import { CompanyDomain } from 'src/domain/company/company.domain';
import { UserDomain } from 'src/domain/user/user.domain';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { FilterUserDto } from 'src/modules/user/dto/filter-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { SessionService } from 'src/resources/services/session.service';
import { VerificationService } from 'src/resources/services/verification.service';

@Injectable()
export class UserApplication {
  constructor(
    private readonly userDomain: UserDomain,
    private readonly companyDomain: CompanyDomain,
    private readonly verificationService: VerificationService,
    private readonly sessionService: SessionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User();

    Object.assign(newUser, createUserDto);

    newUser.verificationCode =
      this.verificationService.generateVerificationCode();
    newUser.codeCreatedAt = new Date();
    newUser.isActive = false;
    const createdUser: User = await this.userDomain.create(newUser);

    // Gerar e enviar o código de verificação
    await this.verificationService.sendVerificationCode(
      createdUser.email,
      newUser.verificationCode,
    );

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

  async myself(): Promise<User> {
    const loggedUser: User = this.sessionService.getUser();
    return loggedUser;
  }

  async findPaginated(
    filteruserDto: FilterUserDto,
  ): Promise<{ data: User[]; pagination: Pagination }> {
    let where: WhereOptions = {};
    if (filteruserDto.fullName) {
      where = {
        ...where,
        fullName: { [Op.like]: `%${filteruserDto.fullName}%` },
      };
    }

    if (filteruserDto.phone) {
      where = { ...where, phone: { [Op.like]: `%${filteruserDto.phone}%` } };
    }

    if (filteruserDto.email) {
      where = {
        ...where,
        email: { [Op.like]: `%${filteruserDto.email}%` },
      };
    }

    if (filteruserDto.identifier) {
      where = {
        ...where,
        identifier: { [Op.like]: `%${filteruserDto.identifier}%` },
      };
    }

    if (filteruserDto.companyId) {
      const company: Company = await this.companyDomain.findByStringId(
        filteruserDto.companyId,
      );
      where = { ...where, companyId: company.id };
    }

    return this.userDomain.findPaginated(
      where,
      filteruserDto?.pagination?.page,
      filteruserDto?.pagination?.limit,
    );
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
