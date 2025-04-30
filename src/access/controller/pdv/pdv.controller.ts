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
} from '@nestjs/common';
import { PdvApplication } from 'src/application/pdv/pdv.application';
import { Pdv } from 'src/models/pdv.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Controller('pdv')
@UseGuards(AuthGuard)
export class PdvController {
  constructor(private readonly pdvApplication: PdvApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(@Body() createPdvDto: CreateUserDto) {
    const newPdv: Pdv = await this.pdvApplication.create(createPdvDto);
    return newPdv;
  }

  @Get()
  async findAll() {
    console.log('id');
    return await this.pdvApplication.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pdvApplication.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePdvDto: UpdateUserDto,
    @Req() requestPdv: RequestUser,
  ) {
    return this.pdvApplication.update(requestPdv.user.sub, updatePdvDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.pdvApplication.remove(id);
    return;
  }
}
