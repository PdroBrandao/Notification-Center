import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreditCardOrderService } from './credit-card-order.service';
import { CreateCreditCardOrderDto } from './dto/create-credit-card-order.dto';
import { UpdateCreditCardOrderDto } from './dto/update-credit-card-order.dto';

@Controller('credit-card-order')
export class CreditCardOrderController {
  constructor(private readonly creditCardOrderService: CreditCardOrderService
  ) { }

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createCreditCardOrderDto: CreateCreditCardOrderDto) {
    return this.creditCardOrderService.create(createCreditCardOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  findAll() {
    return this.creditCardOrderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('basic'))
  findOne(@Param('id') id: string) {
    return this.creditCardOrderService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Body() updateCreditCardOrderDto: UpdateCreditCardOrderDto) {
    return this.creditCardOrderService.update(id, updateCreditCardOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string) {
    return this.creditCardOrderService.remove(id);
  }
}
