import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompetitionTypeEnum } from './enum/competition-type.enum';
import { CompetitionLevelEnum } from './enum/competition-level.enum';
import { AddressEntity } from '../address/address.entity';
import { ResultEntity } from '../result/result.entity';

@Entity('competition')
export class CompetitionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', nullable: false, length: 150 })
  name: string;

  @Column({
    name: 'type',
    nullable: false,
    type: 'enum',
    enum: CompetitionTypeEnum,
  })
  type: CompetitionTypeEnum;

  @Column({
    name: 'level',
    nullable: false,
    type: 'enum',
    enum: CompetitionLevelEnum,
  })
  level: CompetitionLevelEnum;

  @Column({ name: 'begin', nullable: false })
  begin: Date;

  @Column({ name: 'end', nullable: false })
  end: Date;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @OneToMany(() => AddressEntity, (address) => address.competition)
  addresses: Array<AddressEntity>;

  @OneToOne(() => ResultEntity, (result) => result.competition)
  @JoinColumn()
  result: ResultEntity;
}
