import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ContractApplication } from 'src/application/contract/contract.application';
import { Pagination } from 'src/domain/base.domain';
import { Contract } from 'src/models/contract.model';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { CreateContractDto } from 'src/modules/contract/dto/create-contract.dto';
import { FilterContractDto } from 'src/modules/contract/dto/filter-contract.dto';
import { ListContractDto } from 'src/modules/contract/dto/list-contract.dto';
import { UpdateContractDto } from 'src/modules/contract/dto/update-contract.dto';

@Controller('contract')
@UseGuards(AuthGuard)
export class ContractController {
  constructor(private readonly contractApplication: ContractApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(
    @Body() createContractDto: CreateContractDto,
  ): Promise<ListContractDto> {
    console.log('createContractDto', createContractDto);
    const newContract: Contract =
      await this.contractApplication.create(createContractDto);
    if (!newContract) {
      throw new Error('CONTRACT_NOT_CREATED');
    }
    const contract: ListContractDto = new ListContractDto(
      newContract.stringId,
      newContract.provider,
      newContract.rentValue,
      newContract.debitTax,
      newContract.pixTax,
      newContract.creditTax,
      newContract.creditLowTax,
      newContract.creditHighTax,
      newContract.paymentIntervalDay,
      newContract.companyId,
    );
    return contract;
  }

  @Post('list')
  async paginatedList(
    @Body() filterCompanyDto: FilterContractDto,
  ): Promise<{ data: ListContractDto[]; pagination: Pagination }> {
    const contracts: { data: Contract[]; pagination: Pagination } =
      await this.contractApplication.findPaginated(filterCompanyDto);
    const listCompanyDto: ListContractDto[] = contracts.data.map(
      (contract: Contract) =>
        new ListContractDto(
          contract.stringId,
          contract.provider,
          contract.rentValue,
          contract.debitTax,
          contract.pixTax,
          contract.creditTax,
          contract.creditLowTax,
          contract.creditHighTax,
          contract.paymentIntervalDay,
          contract.companyId,
        ),
    );

    return {
      data: listCompanyDto,
      pagination: contracts.pagination,
    };
  }

  @Get()
  async findAll(): Promise<Array<ListContractDto>> {
    const contracts: Array<Contract> = await this.contractApplication.findAll();
    const contractList: Array<ListContractDto> = contracts.map(
      (contract: Contract) =>
        new ListContractDto(
          contract.stringId,
          contract.provider,
          contract.rentValue,
          contract.debitTax,
          contract.pixTax,
          contract.creditTax,
          contract.creditLowTax,
          contract.creditHighTax,
          contract.paymentIntervalDay,
          contract.companyId,
        ),
    );
    return contractList;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ListContractDto> {
    const contract: Contract = await this.contractApplication.findOne(id);
    if (!contract) {
      throw new Error('CONTRACT_NOT_FOUND');
    }
    const contractList: ListContractDto = new ListContractDto(
      contract.stringId,
      contract.provider,
      contract.rentValue,
      contract.debitTax,
      contract.pixTax,
      contract.creditTax,
      contract.creditLowTax,
      contract.creditHighTax,
      contract.paymentIntervalDay,
      contract.companyId,
    );
    return contractList;
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<ListContractDto> {
    const contract: Contract = await this.contractApplication.update(
      id,
      updateContractDto,
    );
    if (!contract) {
      throw new Error('CONTRACT_NOT_FOUND');
    }
    const contractList: ListContractDto = new ListContractDto(
      contract.stringId,
      contract.provider,
      contract.rentValue,
      contract.debitTax,
      contract.pixTax,
      contract.creditTax,
      contract.creditLowTax,
      contract.creditHighTax,
      contract.paymentIntervalDay,
      contract.companyId,
    );
    if (!contractList) {
      throw new Error('CONTRACT_NOT_FOUND');
    }

    return contractList;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.contractApplication.remove(id);
    return;
  }
}
