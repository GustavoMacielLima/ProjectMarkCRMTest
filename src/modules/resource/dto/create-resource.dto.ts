import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ResourceType } from 'src/models/resource.model';

export class CreateResourceDto {
  @IsEnum(ResourceType, { message: 'INVALID_TYPE' })
  @IsNotEmpty({ message: 'REQUIRED_TYPE' })
  type: ResourceType;

  @IsNotEmpty({ message: 'REQUIRED_URL' })
  url: string;

  @IsNotEmpty({ message: 'REQUIRED_DESCRIPTION' })
  description: string;

  @IsOptional()
  topicId?: number;
}
