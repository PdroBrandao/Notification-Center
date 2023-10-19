import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePixInstallmentDto } from './dto/create-pix-installment.dto';
import { UpdatePixInstallmentDto } from './dto/update-pix-installment.dto';
import { PixInstallment, PixInstallmentDocument} from './entities/pix-installment.entity';
import { ValidationsHelpers } from 'src/utils/validations';
import { ErrorLogService } from "src/error-log/error-log.service";
import * as moment from 'moment-timezone';

import { WhatsappNotificationService } from 'src/whatsapp-notification/whatsapp-notification.service';
import { MailgunNotificationService } from 'src/mailgun-notification/mailgun-notification.service';

import { ScheduledTaskService } from 'src/scheduled-task/scheduled-task.service';

import { PixInstallmentsNotificationTemplates } from 'src/whatsapp-notification/models/pix_installments_templates';
import { PixInstallmentsMailgunTemplates } from 'src/mailgun-notification/models/pix_installments_mailguntemplates';

@Injectable()
export class PixInstallmentsService {

    constructor(
      @InjectModel(PixInstallment.name) private pixInstallmentModel: Model<PixInstallmentDocument>,
      private readonly errorLogService: ErrorLogService,
      private readonly whatsappNotificationService: WhatsappNotificationService,
      private readonly mailgunNotificationService: MailgunNotificationService,
      private readonly scheduleTaskService: ScheduledTaskService
    ){
      moment.tz.setDefault(process.env.APP_TIMEZONE);
    }



  async create(createPixInstallmentDto: CreatePixInstallmentDto) {

  // 1º Validar se o IdExterno é único
    const previusPixOrder = this.pixInstallmentModel.find({
      external_id: createPixInstallmentDto.external_id
    })
    
    try {
      await ValidationsHelpers.externalIdUniqueValidation(previusPixOrder)
    } catch(e) {
      const response = e.response;
      // Gera um log de erro que o id não foi validado
      this.errorLogService.generateLog(
        createPixInstallmentDto.external_id,
        response.message + ' | ' + response.error
      );
      console.log('error:', e)
      throw e;
    }

    // 2º Paid or not
    const pixInstallment = new this.pixInstallmentModel(createPixInstallmentDto)
    const canSendTickets = this.isPaidStatus(pixInstallment)

    // 3º Se paid, envia ingresso. Se não, envia notificação.
    if (canSendTickets){
      this.sendPixPaidMessages(createPixInstallmentDto.external_id ,pixInstallment);
    } else {
      // Cobrança nos vencimentos
      console.log(" >>>>> Aqui eu tenho que entrar na scheduleInstallmentsNotifications <<<<")
      this.scheduleInstallmentsNotifications(pixInstallment);
      // Mensagem com códigos
      console.log(" >>>>> Aqui eu tenho que entrar na sendPixPendingMessages <<<<")
      this.sendPixPendingMessages(createPixInstallmentDto.external_id , pixInstallment); 
    }    

    console.log("PixInstallmentsService >>> create >>> pixInstallment", pixInstallment)
    return pixInstallment.save();
  }

  async update(external_id: string, UpdatePixInstallmentDto:UpdatePixInstallmentDto) {

    const oldPixOrder = await this.pixInstallmentModel.findOne({external_id: external_id}).exec()
    console.log("oldPixOrder -> ",oldPixOrder)
    if (oldPixOrder) {
      const newPixOrder = new this.pixInstallmentModel(UpdatePixInstallmentDto)
      console.log("newPixOrder -> ",newPixOrder)

      if (oldPixOrder.transaction[0].status == 'pending' && newPixOrder.transaction[0].status == 'paid') {
        console.log("Enviei a msg")
        this.sendPixPaidMessages(external_id, newPixOrder);
      }
    }

    return this.pixInstallmentModel.findOneAndUpdate(
      { external_id: external_id }, { $set: UpdatePixInstallmentDto }, { new: true }
    );
  }

  async sendPixPendingMessages(external_id:string, pixInstallment:PixInstallment){

    // WHATSAPP
    // Pego as mensagens a serem enviadas
    const pixInstallmentNotificationTemplates = new PixInstallmentsNotificationTemplates(pixInstallment)
    const messages = pixInstallmentNotificationTemplates.templatePixOrderPending();

    // Formato o Celular
    const whatsapp = pixInstallment.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

    for await (const message of messages) {
      //console.log('message:', message)
      await this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.CodePix');
    }

    //Email
    const pixMailgunTemplates = new PixInstallmentsMailgunTemplates(pixInstallment);
    const dataEmail = pixMailgunTemplates.mailgunPixOrder();
    //console.log('sendPixPendingMessages->dataEmail:', dataEmail)
    console.log("(Email) - Enviando Email")

    this.mailgunNotificationService.sendEmail(dataEmail);

  }

  sendPixPaidMessages(external_id:string, pixInstallment:PixInstallment){
    
    // WHATSAPP
    // Pego as mensagens a serem enviadas
    const pixInstallmentNotificationTemplates = new PixInstallmentsNotificationTemplates(pixInstallment)
    const message = pixInstallmentNotificationTemplates.templatePixOrderPaid();

    // Formato o Celular
    const whatsapp = pixInstallment.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;
    
    // Envia a mensagem
    console.log('message:', message)
    this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.CodePix')

    // EMAIL
    const pixMailgunTemplates = new PixInstallmentsMailgunTemplates(pixInstallment);
    const dataEmail = pixMailgunTemplates.mailgunSendingTicketPix();
    console.log("<<Enviando Email - INGRESSO>>")

    this.mailgunNotificationService.sendEmail(dataEmail);
  }

  isPaidStatus(pixInstallment: PixInstallment) : boolean{
    if (pixInstallment.transaction && pixInstallment.transaction.length > 0) {
      return pixInstallment.transaction[0].status == 'paid'
    }
    return false
  }

  findAll() {
    return `This action returns all pixInstallments`;
  }

  findOne(external_id: string) {
    return this.pixInstallmentModel.findOne({external_id: external_id})
  }

  remove(id: number) {
    return `This action removes a #${id} pixInstallment`;
  }

  scheduleInstallmentsNotifications(pixInstallment: PixInstallment) : void {

    const installments = pixInstallment.installments;
    const transaction = pixInstallment.transaction;

    //console.log("scheduleInstallmentsNotifications -> transaction",transaction);
    

    for (let i = 0; i < installments; i++) {
      const today = moment().startOf('day');
      const dueDate = moment(transaction[i].due_date).startOf('day');

      console.log("scheduleInstallmentsNotifications -> Due_date >>> ",transaction[i].due_date);

      // Only schedule to pending and transactions that due in the future
      if (dueDate.isAfter(today) && transaction[i].status != 'paid') {
        this.scheduleTaskService.createSchedule(
          transaction[i].due_date,
          'pix_installments',
          pixInstallment.external_id,
          pixInstallment.external_id,
          i
        )
      }
    }
  }
}
