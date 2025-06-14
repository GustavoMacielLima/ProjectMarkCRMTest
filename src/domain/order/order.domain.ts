import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { RepositoryProvider } from 'src/repository/repository.provider';
import { BaseDomain } from '../base.domain';
import { SessionService } from 'src/resources/services/session.service';
import { Order } from 'src/models/order.model';

@Injectable()
export class OrderDomain extends BaseDomain<Order> {
  constructor(
    @Inject(RepositoryProvider.ORDER)
    orderRepository: Repository<Order>,
    public readonly sessionService: SessionService,
  ) {
    super(orderRepository, sessionService);
  }

  public async createNewOrder(order: Order): Promise<Order> {
    console.log('order', order);
    order.completedAt = new Date();
    const newOrder = await this.create(order);
    return newOrder;
  }

  protected getEntityName(): string {
    return 'ORDER';
  }
}
