import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CompetitionEntity } from '../competition/competition.entity';

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'postal_code', nullable: false })
  postalCode: string;

  @Column({ name: 'address', nullable: false, length: 100 })
  address: string;

  @Column({ name: 'number', nullable: false })
  number: number;

  @Column({ name: 'complement', nullable: true, length: 30 })
  complement: string;

  @Column({ name: 'country', nullable: false, length: 30 })
  country: string;

  @Column({ name: 'state', nullable: false, length: 30 })
  state: string;

  @Column({ name: 'city', nullable: false, length: 30 })
  city: string;

  @Column({ name: 'main', nullable: false, default: false })
  main: boolean;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CompetitionEntity, (competition) => competition.addresses)
  competition: CompetitionEntity;
}
