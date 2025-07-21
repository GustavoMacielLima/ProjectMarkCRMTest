import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Topics',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class Topic extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  version: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentTopicId: number;

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
