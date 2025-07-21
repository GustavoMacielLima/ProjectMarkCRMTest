import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Topic } from './topic.model';

export enum ResourceType {
  VIDEO = 'video',
  ARTICLE = 'article',
  PDF = 'pdf',
}

@Table({
  tableName: 'Resources',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class Resource extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  topicId: number;

  @BelongsTo(() => Topic)
  topic: Topic;

  @Column({
    type: DataType.ENUM(...Object.values(ResourceType)),
    allowNull: false,
    defaultValue: ResourceType.VIDEO,
  })
  type: ResourceType;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date;
}
