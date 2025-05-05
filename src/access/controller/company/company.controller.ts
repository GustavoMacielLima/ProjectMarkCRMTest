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
  NotFoundException,
} from '@nestjs/common';
import { CompanyApplication } from 'src/application/company/company.application';
import { Company } from 'src/models/company.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { CreateCompanyDto } from 'src/modules/company/dto/create-company.dto';
import { ListCompanyDto } from 'src/modules/company/dto/list-company.dto';
import { UpdateCompanyDto } from 'src/modules/company/dto/update-company.dto';

@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
  constructor(private readonly companyApplication: CompanyApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<ListCompanyDto> {
    const newCompany: Company =
      await this.companyApplication.create(createCompanyDto);
    return new ListCompanyDto(
      newCompany.stringId,
      newCompany.name,
      newCompany.socialName,
      newCompany.revanueRecord,
      newCompany.phone,
      newCompany.paymentMethod,
      newCompany.mainContact,
      newCompany.email,
      newCompany.address,
      newCompany.isActive,
    );
  }

  @Get()
  async findAll(): Promise<ListCompanyDto[]> {
    const companys: Array<Company> = await this.companyApplication.findAll();
    const listCompanyDto: ListCompanyDto[] = companys.map(
      (company) =>
        new ListCompanyDto(
          company.stringId,
          company.name,
          company.socialName,
          company.revanueRecord,
          company.phone,
          company.paymentMethod,
          company.mainContact,
          company.email,
          company.address,
          company.isActive,
        ),
    );
    return listCompanyDto;
  }

  @Get('contract/:contractId')
  async findByContract(
    @Param('contractId') contractId: string,
  ): Promise<ListCompanyDto> {
    const company: Company =
      await this.companyApplication.findByContract(contractId);
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    const listCompanyDto: ListCompanyDto = new ListCompanyDto(
      company.stringId,
      company.name,
      company.socialName,
      company.revanueRecord,
      company.phone,
      company.paymentMethod,
      company.mainContact,
      company.email,
      company.address,
      company.isActive,
    );
    return listCompanyDto;
  }

  @Get('pdv/:pdvId')
  async findByPdv(@Param('pdvId') pdvId: string): Promise<ListCompanyDto> {
    const company: Company = await this.companyApplication.findByPdv(pdvId);
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    const listCompanyDto: ListCompanyDto = new ListCompanyDto(
      company.stringId,
      company.name,
      company.socialName,
      company.revanueRecord,
      company.phone,
      company.paymentMethod,
      company.mainContact,
      company.email,
      company.address,
      company.isActive,
    );
    return listCompanyDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ListCompanyDto> {
    const company: Company = await this.companyApplication.findOne(id);
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    const listCompanyDto: ListCompanyDto = new ListCompanyDto(
      company.stringId,
      company.name,
      company.socialName,
      company.revanueRecord,
      company.phone,
      company.paymentMethod,
      company.mainContact,
      company.email,
      company.address,
      company.isActive,
    );
    return listCompanyDto;
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() requestCompany: RequestUser,
  ): Promise<ListCompanyDto> {
    const company: Company = await this.companyApplication.update(
      requestCompany.user.sub,
      updateCompanyDto,
    );
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    const listCompanyDto: ListCompanyDto = new ListCompanyDto(
      company.stringId,
      company.name,
      company.email,
      company.socialName,
      company.revanueRecord,
      company.phone,
      company.paymentMethod,
      company.mainContact,
      company.address,
      company.isActive,
    );
    return listCompanyDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.companyApplication.remove(id);
    return;
  }
}
