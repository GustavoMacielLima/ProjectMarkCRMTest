import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ResultEntity } from '../result/result.entity';

@Entity('setups')
export class SetupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Column({ name: 'main', nullable: false, default: false })
  main: boolean;

  @Column({ name: 'description', nullable: true, type: 'longtext' })
  description: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.setups)
  user: UserEntity;

  @OneToOne(() => ResultEntity, (result) => result.setup)
  @JoinColumn()
  result: ResultEntity;
}
