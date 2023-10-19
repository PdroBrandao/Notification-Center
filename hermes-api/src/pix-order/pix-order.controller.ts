import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePixOrderDto } from './dto/create-pix-order.dto';
import { UpdatePixOrderDto } from './dto/update-pix-order.dto';
import { PixOrderService } from './pix-order.service';

@Controller('pix-order')
export class PixOrderController {
  constructor(private readonly pixOrderService: PixOrderService
  ) { }

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createPixOrderDto: CreatePixOrderDto) {
    return this.pixOrderService.create(createPixOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  findAll() {
    return this.pixOrderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('basic'))
  findOne(@Param('id') id: string) {
    return this.pixOrderService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Body() updatePixOrderDto: UpdatePixOrderDto) {
    return this.pixOrderService.update(id, updatePixOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string) {
    return this.pixOrderService.remove(id);
  }
}
