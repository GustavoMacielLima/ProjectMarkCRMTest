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
import { RequestUser } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/models/user.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ListUserDto } from 'src/modules/user/dto/list-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userApplication: UserApplication) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ListUserDto> {
    const newUser: User = await this.userApplication.create(createUserDto);
    return new ListUserDto(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.role,
    );
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<ListUserDto[]> {
    const users: User[] = await this.userApplication.findAll();
    return users.map(
      (user) => new ListUserDto(user.id, user.name, user.email, user.role),
    );
  }

  @Get('myself')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async myself(@Req() requestUser: RequestUser): Promise<ListUserDto> {
    const user: User = await this.userApplication.findOne(requestUser.user.id);
    return new ListUserDto(user.id, user.name, user.email, user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ListUserDto> {
    const user: User = await this.userApplication.findOne(id);
    return new ListUserDto(user.id, user.name, user.email, user.role);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() requestUser: RequestUser,
  ): Promise<ListUserDto> {
    const user: User = await this.userApplication.update(
      requestUser.user.id,
      updateUserDto,
    );
    return new ListUserDto(user.id, user.name, user.email, user.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.userApplication.remove(id);
    return;
  }
}
