import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Company } from './company.model';
import { Contract } from './contract.model';
import { ProviderEnum } from './pdv.model';

export enum PaymentMethodEnum {
  PIX = 'pix',
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum CreditFlagEnum {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  ELO = 'elo',
  AMEX = 'amex',
}

@Table({
  tableName: 'Orders',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class Order extends Model {
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
    type: DataType.ENUM(...Object.values(PaymentMethodEnum)),
    allowNull: false,
    defaultValue: PaymentMethodEnum.PIX,
  })
  paymentMethod: PaymentMethodEnum;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  installment: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(CreditFlagEnum)),
    allowNull: true,
  })
  creditFlag: CreditFlagEnum;

  @ForeignKey(() => Contract)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  contractId: number;

  @BelongsTo(() => Contract)
  contract: Contract;

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
    allowNull: true,
  })
  completedAt?: Date;

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
