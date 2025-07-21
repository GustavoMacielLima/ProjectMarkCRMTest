import { ResourceType } from 'src/models/resource.model';

export class ListResourceDto {
  constructor(
    readonly id: number,
    readonly type: ResourceType,
    readonly url: string,
    readonly description: string,
    readonly topicId?: number,
  ) {}
}
