import { Injectable, NotFoundException } from '@nestjs/common';
import { PdvDomain } from 'src/domain/pdv/pdv.domain';
import { Pdv } from 'src/models/pdv.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Injectable()
export class PdvApplication {
  constructor(private readonly pdvDomain: PdvDomain) {}

  async create(createPdvDto: CreateUserDto): Promise<Pdv> {
    const newPdv: Pdv = new Pdv();

    Object.assign(newPdv, createPdvDto);
    const createdPdv: Pdv = await this.pdvDomain.createNewPdv(newPdv);

    return createdPdv;
  }

  async findAll(): Promise<Array<Pdv>> {
    const pdvs: Array<Pdv> = await this.pdvDomain.findAll();
    return pdvs;
  }

  async findOne(id: string): Promise<Pdv> {
    const pdv: Pdv = await this.pdvDomain.findByStringId(id);
    if (!pdv) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return pdv;
  }

  async update(id: string, updatePdvDto: UpdateUserDto): Promise<Pdv> {
    const pdv = await this.findOne(id);
    Object.assign(pdv, updatePdvDto);
    this.pdvDomain.update(pdv.id, pdv);
    return pdv;
  }

  async remove(id: string) {
    const pdv: Pdv = await this.findOne(id);
    this.pdvDomain.remove(pdv.id);
  }
}
