import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Company } from './company.model';

export enum ProviderEnum {
  PAGSEGURO = 'pagseguro',
  MGPIX = 'mgpix',
}

export enum PaymentIntervalDayEnum {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

@Table({
  tableName: 'Contracts',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class Contract extends Model {
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
    type: DataType.ENUM(...Object.values(ProviderEnum)),
    allowNull: false,
    defaultValue: ProviderEnum.MGPIX,
  })
  provider: ProviderEnum;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  rentValue: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  debitTax: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  pixTax: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  creditTax: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  creditLowTax: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  creditHighTax: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentIntervalDayEnum)),
    allowNull: false,
    defaultValue: PaymentIntervalDayEnum.MONTHLY,
  })
  paymentIntervalDay: PaymentIntervalDayEnum;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  version: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isCurrent: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  mainContact: string;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
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
}
