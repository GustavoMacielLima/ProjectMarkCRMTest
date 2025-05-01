import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyDomain } from 'src/domain/company/company.domain';
import { Company } from 'src/models/company.model';
import { CreateCompanyDto } from 'src/modules/company/dto/create-company.dto';
import { UpdateCompanyDto } from 'src/modules/company/dto/update-company.dto';

@Injectable()
export class CompanyApplication {
  constructor(private readonly companyDomain: CompanyDomain) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const newCompany: Company = new Company();

    Object.assign(newCompany, createCompanyDto);
    const createdCompany: Company = await this.companyDomain.create(newCompany);

    return createdCompany;
  }

  async findAll(): Promise<Array<Company>> {
    const companys: Array<Company> = await this.companyDomain.findAll();
    return companys;
  }

  async findOne(id: string): Promise<Company> {
    const company: Company = await this.companyDomain.findByStringId(id);
    if (!company) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    this.companyDomain.update(company.id, company);
    return company;
  }

  async remove(id: string) {
    const company: Company = await this.findOne(id);
    this.companyDomain.remove(company.id);
  }
}
