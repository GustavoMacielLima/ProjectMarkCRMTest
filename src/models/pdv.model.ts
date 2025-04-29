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

export enum Provider {
  PAGSEGURO = 'pagseguro',
  MGPIX = 'mgpix',
}

export enum PdvStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'Pdvs',
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})
export class Pdv extends Model {
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
    type: DataType.ENUM(...Object.values(Provider)),
    allowNull: false,
    defaultValue: Provider.MGPIX,
  })
  provider: Provider;

  @Column({
    type: DataType.ENUM(...Object.values(PdvStatus)),
    allowNull: false,
    defaultValue: PdvStatus.ACTIVE,
  })
  status: PdvStatus;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  serialNumber: string;

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
  deleteAt: Date;
}
