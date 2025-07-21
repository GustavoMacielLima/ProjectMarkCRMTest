import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString({ message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  name: string;

  @IsNotEmpty({ message: 'REQUIRED_CONTENT' })
  content: string;

  @IsOptional()
  parentTopicId: string;
}
