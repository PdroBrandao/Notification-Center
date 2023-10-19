import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PixInstallmentsService } from './pix-installments.service';
import { CreatePixInstallmentDto } from './dto/create-pix-installment.dto';
import { UpdatePixInstallmentDto } from './dto/update-pix-installment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pix-installments')
export class PixInstallmentsController {
  constructor(private readonly pixInstallmentsService: PixInstallmentsService) {}

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createPixInstallmentDto: CreatePixInstallmentDto) {
    return this.pixInstallmentsService.create(createPixInstallmentDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  findAll() {
    return this.pixInstallmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('basic'))
  findOne(@Param('id') id: string) {
    return this.pixInstallmentsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Body() updatePixInstallmentDto: UpdatePixInstallmentDto) {
    return this.pixInstallmentsService.update(id, updatePixInstallmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string) {
    return this.pixInstallmentsService.remove(+id);
  }
}
