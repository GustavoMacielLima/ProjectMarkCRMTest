import { Injectable, NotFoundException } from '@nestjs/common';
import { TopicDomain } from 'src/domain/topic/topic.domain';
import { Topic } from 'src/models/topic.model';
import { CreateTopicDto } from 'src/modules/topic/dto/create-topic.dto';
import { TopicWithSubTopicsDto } from 'src/modules/topic/dto/list-topic.dto';
import { UpdateTopicDto } from 'src/modules/topic/dto/update-topic.dto';

@Injectable()
export class TopicApplication {
  constructor(private readonly topicDomain: TopicDomain) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const newTopic: Topic = new Topic();

    Object.assign(newTopic, createTopicDto);
    newTopic.version = 1;
    const createdTopic: Topic = await this.topicDomain.createNewTopic(newTopic);

    return createdTopic;
  }

  async findAll(): Promise<Array<Topic>> {
    const topics: Array<Topic> = await this.topicDomain.findAll();
    return topics;
  }

  async findOne(id: number): Promise<Topic> {
    const topic: Topic = await this.topicDomain.findByPk(id);
    if (!topic) {
      throw new NotFoundException('TOPIC_NOT_FOUND');
    }
    return topic;
  }

  async findAllSubTopics(parentTopicId: number): Promise<Array<Topic>> {
    const subTopics: Array<Topic> = await this.topicDomain.findAll({
      parentTopicId,
    });
    return subTopics;
  }

  async findAllTopicsWithSubTopics(
    topics: Array<Topic>,
  ): Promise<Array<TopicWithSubTopicsDto>> {
    const topicIds: Array<number> = topics.map((topic: Topic) => topic.id);
    const topicsWithSubTopics: Array<TopicWithSubTopicsDto> = [];
    const subTopics: Array<Topic> = await this.topicDomain.findAll({
      parentTopicId: topicIds,
    });
    const mapSubTopics: Map<number, Array<TopicWithSubTopicsDto>> = new Map();

    for (const subTopic of subTopics) {
      const topicWithSubTopics: TopicWithSubTopicsDto =
        new TopicWithSubTopicsDto(
          subTopic.id,
          subTopic.name,
          subTopic.content,
          subTopic.parentTopicId,
          [],
        );
      if (mapSubTopics.has(subTopic.parentTopicId)) {
        mapSubTopics.get(subTopic.parentTopicId).push(topicWithSubTopics);
      } else {
        mapSubTopics.set(subTopic.parentTopicId, [topicWithSubTopics]);
      }
    }

    for (const topic of topics) {
      const currentSubTopics: Array<TopicWithSubTopicsDto> = mapSubTopics.has(
        topic.id,
      )
        ? mapSubTopics.get(topic.id)
        : [];
      topicsWithSubTopics.push(
        new TopicWithSubTopicsDto(
          topic.id,
          topic.name,
          topic.content,
          topic.parentTopicId,
          currentSubTopics,
        ),
      );
    }
    return topicsWithSubTopics;
  }

  async update(id: number, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.findOne(id);
    Object.assign(topic, updateTopicDto);
    this.topicDomain.update(topic.id, topic);
    return topic;
  }

  async remove(id: number) {
    const topic: Topic = await this.findOne(id);
    this.topicDomain.remove(topic.id);
  }
}
