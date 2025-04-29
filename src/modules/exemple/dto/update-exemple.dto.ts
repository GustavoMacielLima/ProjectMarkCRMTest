import { PartialType } from '@nestjs/mapped-types';
import { CreateExempleDto } from './create-exemple.dto';

export class UpdateExempleDto extends PartialType(CreateExempleDto) {}
