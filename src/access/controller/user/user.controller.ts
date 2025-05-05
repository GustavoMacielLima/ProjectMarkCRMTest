import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserApplication } from 'src/application/user/user.application';
import { User } from 'src/models/user.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ListUserDto } from 'src/modules/user/dto/list-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { PasswordHash } from 'src/resources/pipes/password-hash.pipe';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userApplication: UserApplication) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Body('password', PasswordHash) passwordHash: string,
  ): Promise<ListUserDto> {
    createUserDto.password = passwordHash;
    const newUser: User = await this.userApplication.create(createUserDto);
    return new ListUserDto(
      newUser.stringId,
      newUser.fullName,
      newUser.email,
      newUser.phone,
      newUser.role,
      newUser.isActive,
      newUser.identifier,
    );
  }

  @Get()
  async findAll(): Promise<ListUserDto[]> {
    const users: User[] = await this.userApplication.findAll();
    return users.map(
      (user) =>
        new ListUserDto(
          user.stringId,
          user.fullName,
          user.email,
          user.phone,
          user.role,
          user.isActive,
          user.identifier,
        ),
    );
  }

  @Get('myself')
  async myself(@Req() requestUser: RequestUser): Promise<ListUserDto> {
    const user: User = await this.userApplication.findOne(requestUser.user.sub);
    return new ListUserDto(
      user.stringId,
      user.fullName,
      user.email,
      user.phone,
      user.role,
      user.isActive,
      user.identifier,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ListUserDto> {
    const user: User = await this.userApplication.findOne(id);
    return new ListUserDto(
      user.stringId,
      user.fullName,
      user.email,
      user.phone,
      user.role,
      user.isActive,
      user.identifier,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() requestUser: RequestUser,
  ): Promise<ListUserDto> {
    const user: User = await this.userApplication.update(
      requestUser.user.sub,
      updateUserDto,
    );
    return new ListUserDto(
      user.stringId,
      user.fullName,
      user.email,
      user.phone,
      user.role,
      user.isActive,
      user.identifier,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userApplication.remove(id);
    return;
  }
}
