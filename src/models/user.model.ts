import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Company } from './company.model';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
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
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  stringId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING(14),
    allowNull: false,
    unique: true,
  })
  identifier: string;

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
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING(8),
    allowNull: true,
  })
  verificationCode: string;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

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

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  codeCreatedAt: Date;
}
