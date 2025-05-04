import { NotFoundException } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Model, Repository } from 'sequelize-typescript';
import { User, UserRole } from 'src/models/user.model';
import { SessionService } from 'src/resources/services/session.service';
import { v4 as uuid } from 'uuid';

export class BaseDomain<T extends Model> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly sessionService: SessionService,
  ) {}

  private setConstraints(record: T, isNewRecord: boolean): void {
    const loggedUser: User = this.sessionService.getUser();
    if (
      loggedUser &&
      loggedUser.role !== UserRole.ADMIN &&
      'companyId' in this.repository
    ) {
      record.setDataValue('companyId', loggedUser.companyId);
    }

    record.setDataValue('updatedAt', new Date());
    if (isNewRecord) {
      record.setDataValue('stringId', uuid());
      record.setDataValue('createdAt', new Date());
    }
  }

  private setSearchContraints(
    whereOptions: WhereOptions = {},
    withTrashed: boolean = false,
  ): void {
    const loggedUser: User = this.sessionService.getUser();
    if (
      loggedUser &&
      loggedUser.role !== UserRole.ADMIN &&
      'companyId' in this.repository
    ) {
      whereOptions['companyId'] = loggedUser.companyId;
    }

    if (!withTrashed) {
      whereOptions['deletedAt'] = null;
    }
  }

  async create(record: T): Promise<T> {
    this.setConstraints(record, true);
    const newEntity = await this.repository.create({ ...record.get() });
    return newEntity;
  }

  async findPaginated(
    whereOptions: WhereOptions = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: T[]; pagination: Pagination }> {
    this.setSearchContraints(whereOptions);

    const offset = (page - 1) * limit;
    const { rows: data, count: total } = await this.repository.findAndCountAll({
      where: whereOptions,
      limit,
      offset,
    });

    const pages = Math.ceil(total / limit);

    const pagination: Pagination = {
      total,
      page,
      pages,
    };

    return {
      data,
      pagination,
    };
  }

  async findAll(whereOptions: WhereOptions = {}): Promise<Array<T>> {
    this.setSearchContraints(whereOptions);
    const entities = await this.repository.findAll();
    return entities;
  }

  async findOne(
    whereOptions: WhereOptions = {},
    emptyValue: boolean = false,
  ): Promise<T> {
    this.setSearchContraints(whereOptions);
    const entity = await this.repository.findOne({ where: whereOptions });
    if (!entity && !emptyValue) {
      throw new NotFoundException(`${this.getEntityName()}_NOT_FOUND`);
    }
    return entity;
  }

  async findByStringId(id: string): Promise<T> {
    const entity = await this.findOne({ stringId: id });
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()}_NOT_FOUND`);
    }
    return entity;
  }

  async findByPk(id: number): Promise<T> {
    const entity = await this.repository.findByPk(id);
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()}_NOT_FOUND`);
    }
    return entity;
  }

  async update(id: number, record: T): Promise<T> {
    this.setConstraints(record, true);
    const entity = await this.findByPk(id);
    await entity.update(record);
    return entity;
  }

  async remove(id: number, destroy: boolean = false): Promise<void> {
    const entity = await this.findByPk(id);
    if (destroy) {
      await entity.destroy();
    }

    if ('deletedAt' in entity) {
      await entity.update({ deletedAt: new Date(), updatedAt: new Date() });
    } else {
      await entity.destroy();
    }
  }

  protected getEntityName(): string {
    return 'ENTITY'; // Subclasses podem sobrescrever para retornar o nome da entidade
  }
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}
