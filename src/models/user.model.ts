import { Column, Model, Table, DataType } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Table({
  tableName: 'Users',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class User extends Model {
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
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: 'manager',
  })
  role: UserRole;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email: string;

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
