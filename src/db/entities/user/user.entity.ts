import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifyEntity } from '../identify/identify.entity';
import { NacionalityEnum } from './enum/nacionality.enum';
import { PhoneEntity } from '../phone/phone.entity';
import { AddressEntity } from '../address/address.entity';
import { SetupEntity } from '../setup/setup.entity';
import { ResultEntity } from '../result/result.entity';
import { GenderEnum } from './enum/gender.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', length: 100, nullable: false })
  email: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Exclude()
  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ name: 'social_name', length: 100, nullable: true })
  socialName: string;

  @Column({ name: 'gender', type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ name: 'birthday' })
  birthday: Date;

  @Column({ name: 'practice_begin' })
  practiceBegin: Date;

  @Column({
    name: 'nationality',
    type: 'enum',
    enum: NacionalityEnum,
  })
  nationality: NacionalityEnum;

  @Column({ name: 'estadual_inscription', length: 30, nullable: true })
  estadualInscription: string;

  @Column({ name: 'national_inscription', length: 50, nullable: true })
  nationalInscription: string;

  @Column({ name: 'international_inscription', length: 50, nullable: true })
  internationalInscription: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @OneToMany(() => IdentifyEntity, (identify) => identify.user, {
    cascade: true,
    eager: true,
  })
  identifiers: Array<IdentifyEntity>;

  @OneToMany(() => PhoneEntity, (phone) => phone.user, {
    cascade: true,
    eager: true,
  })
  phones: Array<PhoneEntity>;

  @OneToMany(() => AddressEntity, (address) => address.user, {
    cascade: true,
    eager: true,
  })
  addresses: Array<AddressEntity>;

  @OneToMany(() => SetupEntity, (setup) => setup.user)
  setups: Array<SetupEntity>;

  @OneToMany(() => ResultEntity, (result) => result.user)
  results: Array<ResultEntity>;
}
