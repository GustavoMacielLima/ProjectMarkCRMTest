import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TopicApplication } from 'src/application/topic/topic.application';
import { Topic } from 'src/models/topic.model';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/models/user.model';
import { CreateTopicDto } from 'src/modules/topic/dto/create-topic.dto';
import {
  ListTopicDto,
  TopicWithSubTopicsDto,
} from 'src/modules/topic/dto/list-topic.dto';
import { UpdateTopicDto } from 'src/modules/topic/dto/update-topic.dto';

@Controller('topic')
@UseGuards(AuthGuard)
export class TopicController {
  constructor(private readonly topicApplication: TopicApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async create(@Body() createTopicDto: CreateTopicDto): Promise<ListTopicDto> {
    const newTopic: Topic = await this.topicApplication.create(createTopicDto);
    if (!newTopic) {
      throw new Error('TOPIC_NOT_CREATED');
    }
    const topic: ListTopicDto = new ListTopicDto(
      newTopic.id,
      newTopic.name,
      newTopic.content,
      newTopic.parentTopicId,
      [],
    );
    return topic;
  }

  @Post(':id/subtopic')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async createSubTopic(
    @Param('id') id: number,
    @Body() createTopicDto: CreateTopicDto,
  ): Promise<ListTopicDto> {
    const newTopic: Topic = await this.topicApplication.createSubTopic(
      id,
      createTopicDto,
    );
    if (!newTopic) {
      throw new Error('TOPIC_NOT_CREATED');
    }
    const topic: ListTopicDto = new ListTopicDto(
      newTopic.id,
      newTopic.name,
      newTopic.content,
      newTopic.parentTopicId,
      [],
    );
    return topic;
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async findAll(): Promise<Array<ListTopicDto>> {
    const topics: Array<Topic> = await this.topicApplication.findAll();
    const topicsWithSubTopics: Array<TopicWithSubTopicsDto> =
      await this.topicApplication.findAllTopicsWithSubTopics(topics);
    const topicList: Array<ListTopicDto> = topicsWithSubTopics.map(
      (topic: TopicWithSubTopicsDto) =>
        new ListTopicDto(
          topic.id,
          topic.name,
          topic.content,
          topic.parentTopicId,
          topic.subTopics.map(
            (subTopic: TopicWithSubTopicsDto) =>
              new ListTopicDto(
                subTopic.id,
                subTopic.name,
                subTopic.content,
                subTopic.parentTopicId,
                [],
              ),
          ),
        ),
    );
    return topicList;
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async findOne(@Param('id') id: number): Promise<ListTopicDto> {
    const topic: Topic = await this.topicApplication.findOne(id);
    if (!topic) {
      throw new Error('TOPIC_NOT_FOUND');
    }
    const subTopics: Array<Topic> =
      await this.topicApplication.findAllSubTopics(topic.id);
    const topicList: ListTopicDto = new ListTopicDto(
      topic.id,
      topic.name,
      topic.content,
      topic.parentTopicId,
      subTopics.map(
        (subTopic: Topic) =>
          new ListTopicDto(
            subTopic.id,
            subTopic.name,
            subTopic.content,
            subTopic.parentTopicId,
            [],
          ),
      ),
    );
    return topicList;
  }

  @Get(':id/tree')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async findSubTopicsTree(
    @Param('id') id: number,
  ): Promise<Array<ListTopicDto>> {
    const subTopics: Array<Topic> =
      await this.topicApplication.findAllSubTopics(id);
    const topicList: Array<ListTopicDto> = subTopics.map(
      (topic: Topic) =>
        new ListTopicDto(
          topic.id,
          topic.name,
          topic.content,
          topic.parentTopicId,
          [],
        ),
    );
    return topicList;
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async update(
    @Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<ListTopicDto> {
    const topic: Topic = await this.topicApplication.update(id, updateTopicDto);
    if (!topic) {
      throw new Error('TOPIC_NOT_FOUND');
    }
    const subTopics: Array<Topic> =
      await this.topicApplication.findAllSubTopics(topic.id);
    const topicList: ListTopicDto = new ListTopicDto(
      topic.id,
      topic.name,
      topic.content,
      topic.parentTopicId,
      subTopics.map(
        (subTopic: Topic) =>
          new ListTopicDto(
            subTopic.id,
            subTopic.name,
            subTopic.content,
            subTopic.parentTopicId,
            [],
          ),
      ),
    );
    return topicList;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    await this.topicApplication.remove(id);
    return;
  }
}
