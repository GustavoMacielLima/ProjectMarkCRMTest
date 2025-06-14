import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { WhereOptions } from 'sequelize';
import { Pagination } from 'src/domain/base.domain';
import { CompanyDomain } from 'src/domain/company/company.domain';
import { ContractDomain } from 'src/domain/contract/contract.domain';
import { OrderDomain } from 'src/domain/order/order.domain';
import { Company } from 'src/models/company.model';
import { Contract } from 'src/models/contract.model';
import { Order } from 'src/models/order.model';
import { CreateOrderDto } from 'src/modules/order/create-order.dto';
import { UpdateOrderDto } from 'src/modules/order/update-order.dto';
import { FilterOrderDto } from 'src/modules/order/filter-order.dto';

@Injectable()
export class OrderApplication {
  constructor(
    private readonly orderDomain: OrderDomain,
    private readonly companyDomain: CompanyDomain,
    private readonly contractDomain: ContractDomain,
  ) {}

  private getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder: Order = new Order();
    const company: Company = await this.companyDomain.findByStringId(
      createOrderDto.companyId,
    );

    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }

    const contract: Contract = await this.contractDomain.findOne({
      companyId: company.id,
      stringId: createOrderDto.contractId,
      isCurrent: true,
    });

    if (!contract) {
      throw new NotFoundException('CONTRACT_NOT_FOUND');
    }

    const existingOrder: Order = await this.orderDomain.findOne(
      {
        contractId: contract.id,
        amount: createOrderDto.amount,
        paymentMethod: createOrderDto.paymentMethod,
        installment: createOrderDto.installment,
        creditFlag: createOrderDto.creditFlag,
      },
      true,
    );

    if (existingOrder) {
      throw new BadRequestException('ORDER_ALREADY_EXISTS');
    }

    Object.assign(newOrder, createOrderDto);
    newOrder.companyId = company.id;
    newOrder.contractId = contract.id;
    newOrder.provider = contract.provider;
    const createdOrder: Order = await this.orderDomain.createNewOrder(newOrder);

    return createdOrder;
  }

  async findAll(): Promise<Array<Order>> {
    const orders: Array<Order> = await this.orderDomain.findAll();
    return orders;
  }

  async findOne(id: string): Promise<Order> {
    const order: Order = await this.orderDomain.findByStringId(id);
    if (!order) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return order;
  }

  async findPaginated(
    filterOrderDto: FilterOrderDto,
  ): Promise<{ data: Order[]; pagination: Pagination }> {
    let where: WhereOptions = {};
    if (filterOrderDto.provider) {
      where = {
        ...where,
        provider: filterOrderDto.provider,
      };
    }

    if (filterOrderDto.startAmount && filterOrderDto.endAmount) {
      where = {
        ...where,
        amount: {
          [Op.between]: [filterOrderDto.startAmount, filterOrderDto.endAmount],
        },
      };
    }

    if (filterOrderDto.startAmount && !filterOrderDto.endAmount) {
      where = {
        ...where,
        amount: { [Op.gte]: filterOrderDto.startAmount },
      };
    }

    if (!filterOrderDto.startAmount && filterOrderDto.endAmount) {
      where = {
        ...where,
        amount: { [Op.lte]: filterOrderDto.endAmount },
      };
    }

    if (filterOrderDto.paymentMethod) {
      where = { ...where, paymentMethod: filterOrderDto.paymentMethod };
    }

    if (filterOrderDto.companyId) {
      const company: Company = await this.companyDomain.findByStringId(
        filterOrderDto.companyId,
      );
      where = { ...where, companyId: company.id };
    }

    if (filterOrderDto.contractId) {
      const contract: Contract = await this.contractDomain.findOne({
        stringId: filterOrderDto.contractId,
        isCurrent: true,
      });
      where = { ...where, contractId: contract.id };
    }

    if (filterOrderDto.startCompletedAt && filterOrderDto.endCompletedAt) {
      where = {
        ...where,
        completedAt: {
          [Op.between]: [
            filterOrderDto.startCompletedAt,
            this.getEndOfDay(filterOrderDto.endCompletedAt),
          ],
        },
      };
    }

    if (filterOrderDto.startCompletedAt && !filterOrderDto.endCompletedAt) {
      where = {
        ...where,
        completedAt: { [Op.gte]: filterOrderDto.startCompletedAt },
      };
    }

    if (!filterOrderDto.startCompletedAt && filterOrderDto.endCompletedAt) {
      where = {
        ...where,
        completedAt: {
          [Op.lte]: this.getEndOfDay(filterOrderDto.endCompletedAt),
        },
      };
    }

    console.log(where);
    console.log(filterOrderDto);

    return this.orderDomain.findPaginated(
      where,
      filterOrderDto?.pagination?.page,
      filterOrderDto?.pagination?.limit,
    );
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    this.orderDomain.update(order.id, order);
    return order;
  }

  async remove(id: string) {
    const order: Order = await this.findOne(id);
    this.orderDomain.remove(order.id);
  }
}
