import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { UserApplication } from 'src/application/user/user.application';
import { User } from 'src/models/user.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ListUserDto } from 'src/modules/user/dto/list-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { PasswordHash } from 'src/resources/pipes/password-hash.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userApplication: UserApplication) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Body('password', PasswordHash) passwordHash: string,
  ) {
    createUserDto.password = passwordHash;
    const newUser: User = await this.userApplication.create(createUserDto);
    return new ListUserDto(newUser.id.toString(), newUser.name, newUser.email);
  }

  @Get()
  async findAll() {
    console.log('id');
    return await this.userApplication.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userApplication.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() requestUser: RequestUser,
  ) {
    return this.userApplication.update(
      requestUser.user.internalSub,
      updateUserDto,
    );
  }

  @Put(':id/validate')
  @UseGuards(AuthGuard)
  async validate(
    @Param('id') id: string,
    @Body() validateCode: string,
    @Req() requestUser: RequestUser,
  ) {
    return this.userApplication.validate(
      requestUser.user.internalSub,
      validateCode,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.userApplication.remove(id);
    return;
  }
}
