import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailgunNotificationService } from 'src/mailgun-notification/mailgun-notification.service';
import { PixMailgunTemplates } from 'src/mailgun-notification/models/pix_mailguntemplates';
import { ScheduledTaskService } from 'src/scheduled-task/scheduled-task.service';
import { ValidationsHelpers } from 'src/utils/validations';
import { PixNotificationTemplates } from 'src/whatsapp-notification/models/pix_templates';
import { WhatsappNotificationService } from 'src/whatsapp-notification/whatsapp-notification.service';
import { ErrorLogService } from "src/error-log/error-log.service";
import { CreatePixOrderDto } from './dto/create-pix-order.dto';
import { UpdatePixOrderDto } from './dto/update-pix-order.dto';
import { PixOrder, PixOrderDocument } from './entities/pix-order.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class PixOrderService {
  constructor(
    @InjectModel(PixOrder.name) private pixOrderModel: Model<PixOrderDocument>,
    private readonly whatsappNotificationService: WhatsappNotificationService,
    private readonly mailgunNotificationService: MailgunNotificationService,
    private readonly scheduleTaskService: ScheduledTaskService,
    private readonly errorLogService: ErrorLogService
  ) {
    moment.tz.setDefault(process.env.APP_TIMEZONE);
  }

  
  async create(createPixOrderDto: CreatePixOrderDto) {

    console.log('Received createPixOrderDto:', createPixOrderDto)

    const previusPixOrder = this.pixOrderModel.find({
      external_id: createPixOrderDto.external_id
    })
    console.log('previusPixOrder:', previusPixOrder)
    
    try {

      await ValidationsHelpers.externalIdUniqueValidation(previusPixOrder)

    } catch(e) {
      const response = e.response;
      // Gera um log de erro que o id não foi validado
      this.errorLogService.generateLog(
        createPixOrderDto.external_id,
        response.message + ' | ' + response.error
      );
      console.log('error:', e)
      throw e;
    }
 
    const pixOrder = new this.pixOrderModel(createPixOrderDto)
    console.log('pixOrder:', pixOrder)

    const canSendTickets = this.isPaidStatus(pixOrder);// Verifica se está pago aquele pedido
    console.log('canSendTickets:', canSendTickets)

    if (canSendTickets) {
      console.log('<< Entrou no canSendTickets >>')
      this.sendPixPaidMessages(createPixOrderDto.external_id, pixOrder);

    } else {
      console.log('<< Não Entrou no canSendTickets >>')
      await this.sendPixPendingMessages(createPixOrderDto.external_id, pixOrder);
  
      //Schedule
      let date = moment().add(1, 'hours').startOf('hour').toDate()
      await this.scheduleTaskService.createSchedule(date, 'pix', pixOrder.id, pixOrder.external_id)
  
      date = moment().add(3, 'hours').startOf('hour').toDate()
      await this.scheduleTaskService.createSchedule(date, 'pix', pixOrder.id, pixOrder.external_id)
    }
  
    return pixOrder.save();
  }

  findAll() {
    return this.pixOrderModel.find()
  }

  findOne(external_id: string) {
    return this.pixOrderModel.findOne({external_id: external_id})
  }

  isPaidStatus(pixOrder: PixOrder) : boolean {
    return pixOrder.transaction.status == 'paid';
  }

  async sendPixPendingMessages(external_id: string, pixOrder: PixOrder) {

    //Whatsapp
    const whatsapp = pixOrder.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;
    console.log('sendPixPendingMessages->phone:', phone)

    const pixNotificationTemplates = new PixNotificationTemplates(pixOrder);
    console.log('sendPixPendingMessages->pixNotificationTemplates:', pixNotificationTemplates)
    const messages = pixNotificationTemplates.templatePixOrderPending();
    console.log('sendPixPendingMessages->messages:', messages)

    for await (const message of messages) {
      await this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.CodePix');
    }

    //Email
    const pixMailgunTemplates = new PixMailgunTemplates(pixOrder);
    console.log('sendPixPendingMessages->pixMailgunTemplates:', pixMailgunTemplates)
    const dataEmail = pixMailgunTemplates.mailgunPixOrder();
    console.log('sendPixPendingMessages->dataEmail:', dataEmail)

    this.mailgunNotificationService.sendEmail(dataEmail);
  }

  sendPixPaidMessages(external_id: string, pixOrder: PixOrder) {
    console.log(">> Entrei na função sendPixPaidMessages <<")

    const pixNotificationTemplates = new PixNotificationTemplates(pixOrder);
    console.log('sendPixPaidMessages->pixNotificationTemplates:', pixNotificationTemplates)
    const pixMailgunTemplates = new PixMailgunTemplates(pixOrder);
    console.log('sendPixPaidMessages->pixMailgunTemplates:', pixMailgunTemplates)

    const whatsapp = pixOrder.customer.whatsapp;
    console.log('whatsapp:', whatsapp)
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;
    console.log('sendPixPaidMessages->phone:', phone)

    const message = pixNotificationTemplates.templatePixOrderPaid();
    console.log('sendPixPaidMessages->message:', message)
    // const dataEmail = pixMailgunTemplates.mailgunPixOrderConfirmation();
    const ticketEmail = pixMailgunTemplates.mailgunSendingTicketPix();
    console.log('sendPixPaidMessages->ticketEmail:', ticketEmail)

    // this.mailgunNotificationService.sendEmail(dataEmail);
    this.mailgunNotificationService.sendEmail(ticketEmail);

    this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.CodePix')
  }

  async update(external_id: string, updatePixOrderDto: UpdatePixOrderDto) {

    const oldPixOrder = await this.pixOrderModel.findOne({external_id: external_id}).exec()
    

    if (oldPixOrder) {
      const newPixOrder = new this.pixOrderModel(updatePixOrderDto)

      if (oldPixOrder.transaction.status == 'pending' && newPixOrder.transaction.status == 'paid') {
        this.sendPixPaidMessages(external_id, newPixOrder);
      }
    }

    return this.pixOrderModel.findOneAndUpdate(
      { external_id: external_id }, { $set: updatePixOrderDto }, { new: true }
    );
  }

  remove(external_id: string) {
    return this.pixOrderModel.deleteOne(
      {
        external_id: external_id
      }
    ).exec();
  }
}