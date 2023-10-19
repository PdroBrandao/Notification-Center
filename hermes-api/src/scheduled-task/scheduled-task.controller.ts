import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ScheduledTaskService } from './scheduled-task.service';
import { CreateScheduledTaskDto } from './dto/create-scheduled-task.dto';
import { UpdateScheduledTaskDto } from './dto/update-scheduled-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('scheduled-task')
export class ScheduledTaskController {
  constructor(private readonly scheduledTaskService: ScheduledTaskService) {}

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createScheduledTaskDto: CreateScheduledTaskDto) {
    return this.scheduledTaskService.create(createScheduledTaskDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  findAll() {
    return this.scheduledTaskService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('basic'))
  findOne(@Param('id') id: string) {
    return this.scheduledTaskService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Body() updateScheduledTaskDto: UpdateScheduledTaskDto) {
    return this.scheduledTaskService.update(id, updateScheduledTaskDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string) {
    return this.scheduledTaskService.remove(id);
  }
}
