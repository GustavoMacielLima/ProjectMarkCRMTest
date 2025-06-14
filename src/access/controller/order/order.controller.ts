import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { OrderApplication } from 'src/application/order/order.application';
import { Pagination } from 'src/domain/base.domain';
import { Order } from 'src/models/order.model';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { CreateOrderDto } from 'src/modules/order/create-order.dto';
import { ListOrderDto } from 'src/modules/order/list-order.dto';
import { FilterOrderDto } from 'src/modules/order/filter-order.dto';
import { UpdateOrderDto } from 'src/modules/order/update-order.dto';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderApplication: OrderApplication) {}

  @Post()
  @UseGuards(RoleGuard)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<ListOrderDto> {
    const newOrder: Order = await this.orderApplication.create(createOrderDto);
    if (!newOrder) {
      throw new Error('ORDER_NOT_CREATED');
    }
    const order: ListOrderDto = new ListOrderDto(
      newOrder.stringId,
      newOrder.provider,
      newOrder.paymentMethod,
      newOrder.installment,
      newOrder.creditFlag,
      newOrder.amount,
      newOrder.completedAt,
      newOrder.contractId,
      newOrder.companyId,
    );
    return order;
  }

  @Post('list')
  async paginatedList(
    @Body() filterOrderDto: FilterOrderDto,
  ): Promise<{ data: ListOrderDto[]; pagination: Pagination }> {
    const orders: { data: Order[]; pagination: Pagination } =
      await this.orderApplication.findPaginated(filterOrderDto);
    const listOrderDto: ListOrderDto[] = orders.data.map(
      (order: Order) =>
        new ListOrderDto(
          order.stringId,
          order.provider,
          order.paymentMethod,
          order.installment,
          order.creditFlag,
          order.amount,
          order.completedAt,
          order.contractId,
          order.companyId,
        ),
    );

    return {
      data: listOrderDto,
      pagination: orders.pagination,
    };
  }

  @Get()
  async findAll(): Promise<Array<ListOrderDto>> {
    const orders: Array<Order> = await this.orderApplication.findAll();
    const orderList: Array<ListOrderDto> = orders.map(
      (order: Order) =>
        new ListOrderDto(
          order.stringId,
          order.provider,
          order.paymentMethod,
          order.installment,
          order.creditFlag,
          order.amount,
          order.completedAt,
          order.contractId,
          order.companyId,
        ),
    );
    return orderList;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ListOrderDto> {
    const order: Order = await this.orderApplication.findOne(id);
    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }
    const orderList: ListOrderDto = new ListOrderDto(
      order.stringId,
      order.provider,
      order.paymentMethod,
      order.installment,
      order.creditFlag,
      order.amount,
      order.completedAt,
      order.contractId,
      order.companyId,
    );
    return orderList;
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ListOrderDto> {
    const order: Order = await this.orderApplication.update(id, updateOrderDto);
    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }
    const orderList: ListOrderDto = new ListOrderDto(
      order.stringId,
      order.provider,
      order.paymentMethod,
      order.installment,
      order.creditFlag,
      order.amount,
      order.completedAt,
      order.contractId,
      order.companyId,
    );
    return orderList;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.orderApplication.remove(id);
    return;
  }
}
