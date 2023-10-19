import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { PaymentBookOrderService } from './payment-book-order.service';
import { CreatePaymentBookOrderDto } from './dto/create-payment-book-order.dto';
import { UpdatePaymentBookOrderDto } from './dto/update-payment-book-order.dto'
import { AuthGuard } from '@nestjs/passport';

@Controller('payment-book-order')
export class PaymentBookOrderController {
  constructor(
    private readonly paymentBookOrderService: PaymentBookOrderService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createPaymentBookOrderDto: CreatePaymentBookOrderDto) {
    return this.paymentBookOrderService.create(createPaymentBookOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  findAll() {
    return this.paymentBookOrderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('basic'))
  findOne(@Param('id') id: string) {
    return this.paymentBookOrderService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Body() updatePaymentBookOrderDto: UpdatePaymentBookOrderDto) {
    return this.paymentBookOrderService.update(id, updatePaymentBookOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string) {
    return this.paymentBookOrderService.remove(id);
  }
}
