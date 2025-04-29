import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { SetupEntity } from '../setup/setup.entity';
import { CompetitionEntity } from '../competition/competition.entity';
import { ResultCategoryEnum } from './enum/result-category.enum';

@Entity('results')
export class ResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'first_partial' })
  firstPartial: number;

  @Column({ name: 'second_partial' })
  secondPartial: number;

  @Column({ name: 'total_nine' })
  totalNine: number;

  @Column({ name: 'total_ten' })
  totalTen: number;

  @Column({ name: 'total_x' })
  totalX: number;

  @Column({ name: 'hit' })
  hit: number;

  @Column({
    name: 'category',
    nullable: false,
    type: 'enum',
    enum: ResultCategoryEnum,
  })
  category: ResultCategoryEnum;

  @Column({ name: 'description', type: 'longtext' })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.results)
  user: UserEntity;

  @OneToOne(() => SetupEntity, (setup) => setup.result)
  @JoinColumn()
  setup: SetupEntity;

  @OneToOne(() => CompetitionEntity, (competition) => competition.result)
  @JoinColumn()
  competition: CompetitionEntity;
}
