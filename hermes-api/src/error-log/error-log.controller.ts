import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { ErrorLogService } from './error-log.service';

@Controller('error-log')
export class ErrorLogController {
  constructor(private readonly errorLogService: ErrorLogService
  ) { }

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createErrorLogDto: CreateErrorLogDto) {
    return this.errorLogService.create(createErrorLogDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  findAll() {
    return this.errorLogService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('basic'))
  findOne(@Param('id') id: string) {
    return this.errorLogService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string) {
    return this.errorLogService.remove(id);
  }
}
