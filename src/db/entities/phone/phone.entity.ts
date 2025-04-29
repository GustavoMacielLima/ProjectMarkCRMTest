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

@Entity('phones')
export class PhoneEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'number', length: 20, nullable: false })
  number: string;

  @Column({ name: 'is_whatsapp', nullable: false, default: false })
  isWhatsapp: boolean;

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

  @ManyToOne(() => UserEntity, (user) => user.phones, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
