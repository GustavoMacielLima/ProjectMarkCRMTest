import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { RepositoryProvider } from 'src/repository/repository.provider';
import { BaseDomain } from '../base.domain';
import { SessionService } from 'src/resources/services/session.service';
import { Topic } from 'src/models/topic.model';

@Injectable()
export class TopicDomain extends BaseDomain<Topic> {
  constructor(
    @Inject(RepositoryProvider.TOPIC)
    topicRepository: Repository<Topic>,
    public readonly sessionService: SessionService,
  ) {
    super(topicRepository, sessionService);
  }

  public async createNewTopic(topic: Topic): Promise<Topic> {
    console.log('topic', topic);
    topic.createdAt = new Date();
    const newTopic = await this.create(topic);
    return newTopic;
  }

  public async updateTopic(topic: Topic): Promise<Topic> {
    topic.version = topic.version + 1;
    const subTopics: Array<Topic> = await this.findAll({
      parentTopicId: topic.id,
    });
    const updatedTopic = await this.create(topic);
    for (const subTopic of subTopics) {
      const newSubTopic = new Topic();
      newSubTopic.name = subTopic.name;
      newSubTopic.content = subTopic.content;
      newSubTopic.parentTopicId = updatedTopic.id;
      await this.create(newSubTopic);
    }
    return updatedTopic;
  }

  protected getEntityName(): string {
    return 'TOPIC';
  }
}
