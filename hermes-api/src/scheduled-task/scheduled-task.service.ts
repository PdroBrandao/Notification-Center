import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScheduledTaskDto } from './dto/create-scheduled-task.dto';
import { UpdateScheduledTaskDto } from './dto/update-scheduled-task.dto';
import { ScheduledTask, ScheduledTaskDocument } from './entities/scheduled-task.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class ScheduledTaskService {
  constructor(@InjectModel(ScheduledTask.name) private ScheduledTaskModel: Model<ScheduledTaskDocument>) 
  { 
    moment.tz.setDefault(process.env.APP_TIMEZONE);
  }

  createSchedule(send_date: Date, order_type: string, order_id: string, external_id: string, installment: number = 0) 
  {
    const taskDto = new CreateScheduledTaskDto()

    taskDto.send_date = moment(send_date).toDate()
    taskDto.order_type = order_type
    taskDto.order_id = order_id
    taskDto.external_id = external_id
    taskDto.attempts = 0
    taskDto.notification_status = 'pending'
    taskDto.installment = installment

    console.log(" >>> Criando o Schedule >>> ")

    console.log(" >>> taskDto >>> createSchedule", taskDto)

    const scheduledTask = new this.ScheduledTaskModel(taskDto)
    //return scheduledTask.save();

    return scheduledTask.save()
    .then(savedTask => {
      console.log(" >>> Schedule Salvo com Sucesso >>> ", savedTask);
      return savedTask; // Retornar o documento salvo
    })
    .catch(error => {
      console.error(" >>> Erro ao Salvar o Schedule >>> ", error);
      throw error; // Lançar o erro para ser tratado em um nível superior, se necessário
    });
  }

  create(createScheduledTaskDto: CreateScheduledTaskDto) {
    const scheduledTask = new this.ScheduledTaskModel(createScheduledTaskDto)
    return scheduledTask.save();
  }

  findAll(filter: Object = {}) {
    return this.ScheduledTaskModel.find(filter);
  }

  findOne(external_id: string) {
    return this.ScheduledTaskModel.findOne({external_id: external_id});
  }

  update(external_id: string, updateScheduledTaskDto: UpdateScheduledTaskDto) {
    return this.ScheduledTaskModel.findOneAndUpdate(
      {external_id: external_id},{$set: updateScheduledTaskDto},{new: true}
    );
  }

  remove(external_id: string) {
    return this.ScheduledTaskModel.deleteOne(
      {
        external_id: external_id
      }
    ).exec();
  }
}
