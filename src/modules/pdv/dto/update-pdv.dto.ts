import { PartialType } from '@nestjs/mapped-types';
import { CreatePdvDto } from './create-pdv.dto';

export class UpdatePdvDto extends PartialType(CreatePdvDto) {}
