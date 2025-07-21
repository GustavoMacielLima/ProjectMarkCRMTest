export class ListTopicDto {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly content: string,
    readonly parentTopicId: number,
    readonly subTopics: Array<ListTopicDto>,
  ) {}
}

export class TopicWithSubTopicsDto {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly content: string,
    readonly parentTopicId: number,
    readonly subTopics: Array<TopicWithSubTopicsDto>,
  ) {}
}
