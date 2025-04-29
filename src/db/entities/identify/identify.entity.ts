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
import { DocumentTypeEnum } from './enum/document-type.enum';

@Entity({ name: 'identifiers' })
export class IdentifyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'document_type',
    nullable: false,
    type: 'enum',
    enum: DocumentTypeEnum,
  })
  documentType: DocumentTypeEnum;

  @Column({ name: 'document_number', length: 100, nullable: false })
  documentNumber: string;

  @Column({ name: 'emit_by', length: 50, nullable: false })
  emitBy: string;

  @Column({ name: 'emit_date' })
  emitDate: Date;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.identifiers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
