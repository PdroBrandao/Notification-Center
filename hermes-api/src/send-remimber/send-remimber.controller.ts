import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendRemimbersService } from './send-remimber.service';
import { CreateSendRemimberDto } from './dto/create-send-remimber.dto';
import { UpdateSendRemimberDto } from './dto/update-send-remimber.dto';

@Controller('send-remimber')
export class SendRemimberController {
  constructor(private readonly sendRemimberService: SendRemimbersService) {}

  @Post()
  create(@Body() createSendRemimberDto: CreateSendRemimberDto) {
    return this.sendRemimberService.create(createSendRemimberDto);
  }

  @Get()
  findAll() {
    return this.sendRemimberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendRemimberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSendRemimberDto: UpdateSendRemimberDto) {
    return this.sendRemimberService.update(+id, updateSendRemimberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendRemimberService.remove(+id);
  }
}
