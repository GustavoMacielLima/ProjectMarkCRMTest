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
import { ResourceApplication } from 'src/application/resource/resource.application';
import { Resource } from 'src/models/resource.model';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/models/user.model';
import { CreateResourceDto } from 'src/modules/resource/dto/create-resource.dto';
import { ListResourceDto } from 'src/modules/resource/dto/list-resource.dto';
import { UpdateResourceDto } from 'src/modules/resource/dto/update-resource.dto';

@Controller('resource')
@UseGuards(AuthGuard)
export class ResourceController {
  constructor(private readonly resourceApplication: ResourceApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async create(
    @Body() createPdvDto: CreateResourceDto,
  ): Promise<ListResourceDto> {
    const newPdv: Resource =
      await this.resourceApplication.create(createPdvDto);
    if (!newPdv) {
      throw new Error('PDV_NOT_CREATED');
    }
    const pdv: ListResourceDto = new ListResourceDto(
      newPdv.id,
      newPdv.type,
      newPdv.url,
      newPdv.description,
      newPdv.topicId,
    );
    return pdv;
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async findAll(): Promise<Array<ListResourceDto>> {
    const pdvs: Array<Resource> = await this.resourceApplication.findAll();
    const pdvList: Array<ListResourceDto> = pdvs.map(
      (pdv: Resource) =>
        new ListResourceDto(
          pdv.id,
          pdv.type,
          pdv.url,
          pdv.description,
          pdv.topicId,
        ),
    );
    return pdvList;
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async findOne(@Param('id') id: string): Promise<ListResourceDto> {
    const pdv: Resource = await this.resourceApplication.findOne(id);
    if (!pdv) {
      throw new Error('PDV_NOT_FOUND');
    }
    const pdvList: ListResourceDto = new ListResourceDto(
      pdv.id,
      pdv.type,
      pdv.url,
      pdv.description,
      pdv.topicId,
    );
    return pdvList;
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async update(
    @Param('id') id: string,
    @Body() updatePdvDto: UpdateResourceDto,
  ): Promise<ListResourceDto> {
    const pdv: Resource = await this.resourceApplication.update(
      id,
      updatePdvDto,
    );
    if (!pdv) {
      throw new Error('PDV_NOT_FOUND');
    }
    const pdvList: ListResourceDto = new ListResourceDto(
      pdv.id,
      pdv.type,
      pdv.url,
      pdv.description,
      pdv.topicId,
    );
    return pdvList;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    await this.resourceApplication.remove(id);
    return;
  }
}
