import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { User } from './user.model'; // Relacionamento com o modelo User

@Table({
  tableName: 'Companies',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class Company extends Model {
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
  socialName: string;

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
  revanueRecord: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentMethod: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  mainContact: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  address: string;

  @HasMany(() => User)
  users: User[];

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
