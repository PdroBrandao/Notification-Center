import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';

import { ResendNotificationService } from './resend-notification.service';
import { CreatePaymentBookOrderDto } from 'src/payment-book-order/dto/create-payment-book-order.dto';
import { CreatePixOrderDto } from 'src/pix-order/dto/create-pix-order.dto';
import { CreateCreditCardOrderDto } from 'src/credit-card-order/dto/create-credit-card-order.dto';


@Controller('resend-notification')
export class ResendNotificationController {
  constructor(private readonly resendNotificationService: ResendNotificationService) {}

  @Post('/tickets/credit_card/:id')
  @UseGuards(AuthGuard('basic'))
  createCreditCard(@Param('id') id: string, @Body() createCreditCardOrderDto: CreateCreditCardOrderDto) {
    const creditCardOrder = this.resendNotificationService.createCreditCardOrder(createCreditCardOrderDto);
    return this.resendNotificationService.resendCreditCardTickets(creditCardOrder, id);
  }

  @Post('/tickets/pix/:id')
  @UseGuards(AuthGuard('basic'))
  createPix(@Param('id') id: string, @Body() createPixOrderDto: CreatePixOrderDto) {
    const pixOrder = this.resendNotificationService.createPixOrder(createPixOrderDto);
    return this.resendNotificationService.resendPixTickets(pixOrder, id);
  }

  @Post('/tickets/payment_book/:id')
  @UseGuards(AuthGuard('basic'))
  createPaymentBook(@Param('id') id: string, @Body() createPaymentBookOrderDto: CreatePaymentBookOrderDto) {
    const paymentBookOrder = this.resendNotificationService.createPaymentBookOrder(createPaymentBookOrderDto);
    return this.resendNotificationService.resendPaymentBookTickets(paymentBookOrder, id);
  }

  @Put('/tickets/:paymentMethod/:id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Param('paymentMethod') paymentMethod: string) {
    return this.resendNotificationService.resendTickets(paymentMethod, id);
  }
}
