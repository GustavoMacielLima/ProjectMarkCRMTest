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
import { CompanyApplication } from 'src/application/company/company.application';
import { Company } from 'src/models/company.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ListUserDto } from 'src/modules/user/dto/list-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
  constructor(private readonly companyApplication: CompanyApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(@Body() createCompanyDto: CreateUserDto) {
    const newCompany: Company =
      await this.companyApplication.create(createCompanyDto);
    return new ListUserDto(
      newCompany.id.toString(),
      newCompany.name,
      newCompany.email,
    );
  }

  @Get()
  async findAll() {
    console.log('id');
    return await this.companyApplication.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.companyApplication.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateUserDto,
    @Req() requestCompany: RequestUser,
  ) {
    return this.companyApplication.update(
      requestCompany.user.sub,
      updateCompanyDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.companyApplication.remove(id);
    return;
  }
}
