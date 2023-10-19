import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { ErrorLog, ErrorLogDocument } from './entities/error-log.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLogDocument>,
  ) {
    moment.tz.setDefault(process.env.APP_TIMEZONE);
  }

  generateLog(order_id: string, message: string) {
    const createErrorLogDto       = new CreateErrorLogDto()
    createErrorLogDto.order_id    = order_id;
    createErrorLogDto.external_id = order_id;
    createErrorLogDto.message     = message;
    createErrorLogDto.created_at  = moment().format('YYYY-MM-DD HH:mm:ss');

    this.create(createErrorLogDto);
  }

  create(createErrorLogDto: CreateErrorLogDto) {
    return new this.errorLogModel(createErrorLogDto).save();
  }

  findAll() {
    return this.errorLogModel.find()
  }

  findOne(external_id: string) {
    return this.errorLogModel.findOne({external_id: external_id})
  }

  remove(external_id: string) {
    return this.errorLogModel.deleteOne(
      {
        external_id: external_id
      }
    ).exec();
  }
}