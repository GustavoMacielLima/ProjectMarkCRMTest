import { Injectable } from '@nestjs/common';
import { CreateExempleDto } from './dto/create-exemple.dto';
import { UpdateExempleDto } from './dto/update-exemple.dto';

@Injectable()
export class ExempleService {
  create(createExempleDto: CreateExempleDto) {
    return 'This action adds a new exemple';
  }

  findAll() {
    return `This action returns all exemple`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exemple`;
  }

  update(id: number, updateExempleDto: UpdateExempleDto) {
    return `This action updates a #${id} exemple`;
  }

  remove(id: number) {
    return `This action removes a #${id} exemple`;
  }
}
