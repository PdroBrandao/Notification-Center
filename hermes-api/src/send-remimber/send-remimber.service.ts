import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateSendRemimberDto } from './dto/create-send-remimber.dto';
import { UpdateSendRemimberDto } from './dto/update-send-remimber.dto';
import { SendRemimber, SendRemimberDocument} from './entities/send-remimber.entity';

import { ValidationsHelpers } from 'src/utils/validations';
import { ErrorLogService } from "src/error-log/error-log.service";
//import * as moment from 'moment-timezone';


import { WhatsappNotificationService } from 'src/whatsapp-notification/whatsapp-notification.service';
import { MailgunNotificationService } from 'src/mailgun-notification/mailgun-notification.service';

import { ScheduledTaskService } from 'src/scheduled-task/scheduled-task.service';

import { SendRemimberNotificationTemplates } from 'src/whatsapp-notification/models/send_remimber_templates';
import { PixInstallmentsMailgunTemplates } from 'src/mailgun-notification/models/pix_installments_mailguntemplates';

@Injectable()
export class SendRemimbersService {

  constructor(
    @InjectModel(SendRemimber.name) private sendRemimberModel: Model<SendRemimberDocument>,
    private readonly errorLogService: ErrorLogService,
    private readonly whatsappNotificationService: WhatsappNotificationService,
    private readonly mailgunNotificationService: MailgunNotificationService,
    private readonly scheduleTaskService: ScheduledTaskService
  ){
    //moment.tz.setDefault(process.env.APP_TIMEZONE);
  }


  create(createSendRemimberDto: CreateSendRemimberDto) {

    const sendRemimber = new this.sendRemimberModel(createSendRemimberDto)

    this.sendRemimberMessages(createSendRemimberDto.external_id , sendRemimber); 
    
    return sendRemimber.save();
  }

  async sendRemimberMessages(external_id:string, sendRemimber:SendRemimber){

    // WHATSAPP
    // Pego as mensagens a serem enviadas
    const sendRemimberNotificationTemplates = new SendRemimberNotificationTemplates(sendRemimber)
    const messages = sendRemimberNotificationTemplates.sendRemimber();

    // Formato o Celular
    const whatsapp = sendRemimber.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

    for await (const message of messages) {
      //console.log('message:', message)
      await this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.CodePix');
    }

  }

  findAll() {
    return `This action returns all sendRemimbers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sendRemimber`;
  }

  update(id: number, updateSendRemimberDto: UpdateSendRemimberDto) {
    return `This action updates a #${id} sendRemimber`;
  }

  remove(id: number) {
    return `This action removes a #${id} sendRemimber`;
  }
}
