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
import { CreatePdvDto } from 'src/modules/pdv/dto/create-pdv.dto';
import { ListPdvDto } from 'src/modules/pdv/dto/list-pdv.dto';
import { UpdatePdvDto } from 'src/modules/pdv/dto/update-pdv.dto';

@Controller('pdv')
@UseGuards(AuthGuard)
export class PdvController {
  constructor(private readonly pdvApplication: PdvApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(@Body() createPdvDto: CreatePdvDto): Promise<ListPdvDto> {
    const newPdv: Pdv = await this.pdvApplication.create(createPdvDto);
    if (!newPdv) {
      throw new Error('PDV_NOT_CREATED');
    }
    const pdv: ListPdvDto = new ListPdvDto(
      newPdv.stringId,
      newPdv.provider,
      newPdv.status,
      newPdv.serialNumber,
      newPdv.contractId,
      newPdv.companyId,
    );
    return pdv;
  }

  @Get()
  async findAll(): Promise<Array<ListPdvDto>> {
    const pdvs: Array<Pdv> = await this.pdvApplication.findAll();
    const pdvList: Array<ListPdvDto> = pdvs.map(
      (pdv: Pdv) =>
        new ListPdvDto(
          pdv.stringId,
          pdv.provider,
          pdv.status,
          pdv.serialNumber,
          pdv.contractId,
          pdv.companyId,
        ),
    );
    return pdvList;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ListPdvDto> {
    const pdv: Pdv = await this.pdvApplication.findOne(id);
    if (!pdv) {
      throw new Error('PDV_NOT_FOUND');
    }
    const pdvList: ListPdvDto = new ListPdvDto(
      pdv.stringId,
      pdv.provider,
      pdv.status,
      pdv.serialNumber,
      pdv.contractId,
      pdv.companyId,
    );
    return pdvList;
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePdvDto: UpdatePdvDto,
    @Req() requestPdv: RequestUser,
  ): Promise<ListPdvDto> {
    const pdv: Pdv = await this.pdvApplication.update(
      requestPdv.user.sub,
      updatePdvDto,
    );
    if (!pdv) {
      throw new Error('PDV_NOT_FOUND');
    }
    const pdvList: ListPdvDto = new ListPdvDto(
      pdv.stringId,
      pdv.provider,
      pdv.status,
      pdv.serialNumber,
      pdv.contractId,
      pdv.companyId,
    );
    return pdvList;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.pdvApplication.remove(id);
    return;
  }
}
