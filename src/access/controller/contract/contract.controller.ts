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
import { ContractApplication } from 'src/application/contract/contract.application';
import { Contract } from 'src/models/contract.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Controller('contract')
@UseGuards(AuthGuard)
export class ContractController {
  constructor(private readonly contractApplication: ContractApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(@Body() createContractDto: CreateUserDto) {
    const newContract: Contract =
      await this.contractApplication.create(createContractDto);
    return newContract;
  }

  @Get()
  async findAll() {
    console.log('id');
    return await this.contractApplication.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractApplication.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateUserDto,
    @Req() requestContract: RequestUser,
  ) {
    return this.contractApplication.update(
      requestContract.user.sub,
      updateContractDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contractApplication.remove(id);
    return;
  }
}
