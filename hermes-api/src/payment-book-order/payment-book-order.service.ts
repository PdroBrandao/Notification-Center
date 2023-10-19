import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailgunNotificationService } from 'src/mailgun-notification/mailgun-notification.service';
import { PaymentBookMailgunTemplates } from 'src/mailgun-notification/models/payment-book_mailguntemplates';
import { ScheduledTaskService } from 'src/scheduled-task/scheduled-task.service';
import { ValidationsHelpers } from 'src/utils/validations';
import { PaymentBookNotificationTemplates } from 'src/whatsapp-notification/models/payment_book_notification_templates';
import { WhatsappNotificationService } from 'src/whatsapp-notification/whatsapp-notification.service';
import { ErrorLogService } from "src/error-log/error-log.service";
import { CreatePaymentBookOrderDto } from './dto/create-payment-book-order.dto';
import { UpdatePaymentBookOrderDto } from './dto/update-payment-book-order.dto';
import { PaymentBookOrder, PaymentBookOrderDocument, Transaction } from './entities/payment-book-order.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class PaymentBookOrderService {
  constructor(
    @InjectModel(PaymentBookOrder.name) private paymentBookOrderModel: Model<PaymentBookOrderDocument>,
    private readonly whatsappNotificationService: WhatsappNotificationService,
    private readonly scheduleTaskService: ScheduledTaskService,
    private readonly mailgunNotificationService: MailgunNotificationService,
    private readonly errorLogService: ErrorLogService
  ) {
    moment.tz.setDefault(process.env.APP_TIMEZONE);
  }

  async create(createPaymentBookOrderDto: CreatePaymentBookOrderDto) {
    const previusPaymentBookOrder = this.paymentBookOrderModel.find({
      external_id: createPaymentBookOrderDto.external_id
    })
    
    try {
      await ValidationsHelpers.externalIdUniqueValidation(previusPaymentBookOrder)
    } catch(e) {
      const response = e.response;
      this.errorLogService.generateLog(
        createPaymentBookOrderDto.external_id,
        response.message + ' | ' + response.error
      );
      
      throw e;
    }

    if (createPaymentBookOrderDto.installments != createPaymentBookOrderDto.transactions.length || createPaymentBookOrderDto.installments < 1) {
      throw new BadRequestException(
        'Something bad happened', {
          cause: new Error(),
          description: 'Installments and transactions.length must be same and greater than 0'
        }
      )
    }

    const paymentBookOrder = new this.paymentBookOrderModel(createPaymentBookOrderDto)
    const paidTransactions = this.getPaidTransactions(paymentBookOrder.transactions);
    const canSendTickets = this.paidAllTransactions(paymentBookOrder, paidTransactions);

    if (canSendTickets) {
      this.sendPaymentBookPaidMessages(createPaymentBookOrderDto.external_id, paymentBookOrder);
    } else {
      if (paidTransactions.length) {
        // Não disparar envio de cada parcela paga, pois é um disparo em massa
        // const lastInstallmentPaid = this.extractLastInstallmentPaid(paymentBookOrder, paidTransactions);
        // await this.sendPaymentBookInstallmentPaidMessages(createPaymentBookOrderDto.external_id, paymentBookOrder, lastInstallmentPaid);
      } else {
        console.log(" <<< sendPaymentBookPendingMessages abaixo >>> ")
        this.sendPaymentBookPendingMessages(createPaymentBookOrderDto.external_id, paymentBookOrder);
      }

      this.scheduleInstallmentsNotifications(paymentBookOrder);
    }
 
    return paymentBookOrder.save();
  }

  paidAllTransactions(paymentBookOrder: PaymentBookOrder, paidTransactions: Array<Transaction>) : boolean {
    return paidTransactions.length == paymentBookOrder.installments;
  }

  findAll() {
    return this.paymentBookOrderModel.find()
  }

  findOne(external_id: string) {
    return this.paymentBookOrderModel.findOne({external_id: external_id})
  }

  scheduleInstallmentsNotifications(paymentBookOrder: PaymentBookOrder) : void {
    const installments = paymentBookOrder.installments;
    const transactions = paymentBookOrder.transactions;

    for (let i = 0; i < installments; i++) {
      const today = moment().startOf('day');
      const dueDate = moment(transactions[i].due_date).startOf('day');

      // Only schedule to pending and failed transactions that due in the future
      if (dueDate.isAfter(today) && transactions[i].status != 'paid') {
        this.scheduleTaskService.createSchedule(
          transactions[i].due_date,
          'payment-book',
          paymentBookOrder.external_id,
          paymentBookOrder.external_id,
          i
        )
      }
    }
  }

  getPaidTransactions(transactions: [Transaction]) : Array<Transaction> {
    const paidTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].payment_date != null) {
        paidTransactions.push(transactions[i])
      }
    }

    return paidTransactions;
  }

  extractLastPaymentDate(paidTransactions: Array<Transaction>) : Date {
    let lastInstallmentPaid = 0;
    let lastPaymentDate = paidTransactions[0].payment_date;
    for (let i = 1; i < paidTransactions.length; i++) {
      if (paidTransactions[lastInstallmentPaid].payment_date <= paidTransactions[i].payment_date) {
        lastInstallmentPaid = i;
        lastPaymentDate = paidTransactions[i].payment_date;
      }
    }

    return lastPaymentDate;
  }

  extractLastInstallmentPaid(paymentBookOrder: PaymentBookOrder, paidTransactions: Array<Transaction>) : number {
    const lastPaymentDate = this.extractLastPaymentDate(paidTransactions);
    const transactions = paymentBookOrder.transactions;

    let lastInstallmentPaid = -1;
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].payment_date == lastPaymentDate) {
        lastInstallmentPaid = i;
      }
    }

    return lastInstallmentPaid;
  }

  async sendPaymentBookPendingMessages(external_id: string, paymentBookOrder: PaymentBookOrder) {
    const paymentBookNotificationTemplates = new PaymentBookNotificationTemplates(paymentBookOrder);
    const paymentBookNotificationTemplateMailgun = new PaymentBookMailgunTemplates(paymentBookOrder);
    
    const whatsapp = paymentBookOrder.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

    const message = await paymentBookNotificationTemplates.templatePaymentBookOrderPending()
    const dataEmail = paymentBookNotificationTemplateMailgun.mailgunDigitalBooklet();

    console.log(" <<< mailgunNotificationService abaixo >>> ")
    this.mailgunNotificationService.sendEmail(dataEmail)
    this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.Boletos')
  }

  sendPaymentBookPaidMessages(external_id: string, paymentBookOrder: PaymentBookOrder) {
    const paymentBookNotificationTemplates = new PaymentBookNotificationTemplates(paymentBookOrder);
    const paymentBookMailgunTemplates = new PaymentBookMailgunTemplates(paymentBookOrder);

    const whatsapp = paymentBookOrder.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

    const message = paymentBookNotificationTemplates.templatePaymentBookOrderPaid()
    const dataEmail = paymentBookMailgunTemplates.mailgunSendingTicketPaymentBook()
    const paidEmail = paymentBookMailgunTemplates.mailgunDigitalBookletPaid()

    this.mailgunNotificationService.sendEmail(paidEmail)
    this.mailgunNotificationService.sendEmail(dataEmail)
    
    this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Conf.Pag.Boleto')
  }

  async sendPaymentBookInstallmentPaidMessages(external_id: string, paymentBookOrder: PaymentBookOrder, lastInstallmentPaid: number) {
    const paymentBookNotificationTemplates = new PaymentBookNotificationTemplates(paymentBookOrder);

    const whatsapp = paymentBookOrder.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;
    
    const message = await paymentBookNotificationTemplates.templatePaymentBookOrderInstallmentPaid(lastInstallmentPaid)
    
    this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Conf.Pag.Boleto')
  }

  async update(external_id: string, updatePaymentBookOrderDto: UpdatePaymentBookOrderDto) {
    const oldPaymentBookOrder = await this.paymentBookOrderModel.findOne({external_id: external_id}).exec()
    
    if (oldPaymentBookOrder) {
      const newPaymentBookOrder = new this.paymentBookOrderModel(updatePaymentBookOrderDto)

      const paidTransactions = this.getPaidTransactions(newPaymentBookOrder.transactions);
      const lastInstallmentPaid = this.extractLastInstallmentPaid(newPaymentBookOrder, paidTransactions);

      const canSendTickets = this.paidAllTransactions(newPaymentBookOrder, paidTransactions);
      
      if (canSendTickets) {
        this.sendPaymentBookPaidMessages(external_id, newPaymentBookOrder);
        updatePaymentBookOrderDto.status = 'paid'
      } else if (oldPaymentBookOrder.transactions[lastInstallmentPaid].payment_date == null) {
        // await this.sendPaymentBookInstallmentPaidMessages(external_id, newPaymentBookOrder, lastInstallmentPaid);
      }
    }
    
    return this.paymentBookOrderModel.findOneAndUpdate(
      {external_id: external_id},{$set: updatePaymentBookOrderDto},{new: true}
    );
  };

  remove(external_id: string) {
    return this.paymentBookOrderModel.deleteOne(
      {
        external_id: external_id
      }
    ).exec();
  }
}
