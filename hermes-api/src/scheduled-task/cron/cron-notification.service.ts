import { Injectable } from '@nestjs/common';

import { PaymentBookOrderService } from "src/payment-book-order/payment-book-order.service";
import { PixOrderService } from "src/pix-order/pix-order.service";
import { PixInstallmentsService } from "src/pix-installments/pix-installments.service";
import { MailgunNotificationService } from "src/mailgun-notification/mailgun-notification.service";
import { WhatsappNotificationService } from "src/whatsapp-notification/whatsapp-notification.service";

import { PaymentBookNotificationTemplates } from "src/whatsapp-notification/models/payment_book_notification_templates";
import { PaymentBookMailgunTemplates } from "src/mailgun-notification/models/payment-book_mailguntemplates";

import { PixNotificationTemplates } from "src/whatsapp-notification/models/pix_templates";
import { PixMailgunTemplates } from "src/mailgun-notification/models/pix_mailguntemplates";

import { PixInstallmentsNotificationTemplates } from "src/whatsapp-notification/models/pix_installments_templates";
import { PixInstallmentsMailgunTemplates } from "src/mailgun-notification/models/pix_installments_mailguntemplates";

import * as moment from 'moment-timezone';
import { ScheduledTaskService } from '../scheduled-task.service';

const DAYS_AFTER_PAYMENT_BOOK_EXPIRED_TO_NOTIFICATE = 3;

@Injectable()
export class CronNotificationService {
  constructor(
    private readonly scheduledTaskService: ScheduledTaskService,
    private readonly whatsappNotificationService: WhatsappNotificationService,
    private readonly paymentBookOrderService: PaymentBookOrderService,
    private readonly pixOrderService: PixOrderService,
    private readonly pixInstallmentsService: PixInstallmentsService,
    private readonly mailgunNotificationService: MailgunNotificationService,
  ) { 
    moment.tz.setDefault(process.env.APP_TIMEZONE);
  }

  // BOLETO -> CRON. -> Informa que as parcelas do carnê estão prestes a vencer.
  async searchForPendingNotificationsPaymentBook(maxRetry: number): Promise<void> {
    const sendDate = moment().startOf('day').toDate();
    const filter = {
      notification_status: 'pending',
      attempts: { $lt: maxRetry },
      send_date: sendDate,
      order_type: 'payment-book'
    }

    const scheduleTasks = this.scheduledTaskService.findAll(filter)
    console.log('Running PendingPaymentBook...')
    for await (const doc of scheduleTasks) {
      const paymentBookOrder = await this.paymentBookOrderService.findOne(doc.external_id)

      if (paymentBookOrder && paymentBookOrder.status == 'pending' && paymentBookOrder.transactions[doc.installment].status == 'pending') {
        const whatsapp = paymentBookOrder.customer.whatsapp;
        const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

        // const paymentBookNotificationTemplates = new PaymentBookNotificationTemplates(paymentBookOrder);
        // const message = await paymentBookNotificationTemplates.templatePaymentBookOrderInstallmentPendingExpiring(doc.installment)

        // const success = await this.whatsappNotificationService.sendMessage(phone, message, doc.external_id, 'Env.Lembrete')
        
        // TODO: delete below after reactivate
        const success = false;

        const paymentBookMailgunTemplates = new PaymentBookMailgunTemplates(paymentBookOrder);
        const dataEmail = paymentBookMailgunTemplates.mailgunDigitalBookletPending() //Aqui está chamando o email de cobrança de boleto

        this.mailgunNotificationService.sendEmail(dataEmail)

        if (success) {
          doc.notification_status = 'sent'
        } else {
          doc.attempts = doc.attempts + 1
        }

        doc.save()
        console.log(doc)
      }
    }
  }

  // PIX PARCELADO -> CRON. -> Informa que o código pix está vencendo.
  async searchForPendingNotificationsPixInstallments(maxRetry: number): Promise<void> {

    console.log('CRON. PIX PARCELADO')
    
    const sendDate = moment().startOf('day').toDate();
    console.log('>>> sendDate >>>', sendDate)
    
    // Cria um filtro para buscar as tarefas agendadas
    const filter = {
      notification_status: 'pending',
      attempts: { $lt: maxRetry },
      send_date: sendDate,
      order_type: 'pix_installments'
    }

    const scheduleTasks = this.scheduledTaskService.findAll(filter)
    console.log('>>> scheduleTasks >>>', scheduleTasks) 
    
    for await (const doc of scheduleTasks) {

      const pixInstallmentsOrder = await this.pixInstallmentsService.findOne(doc.external_id)

      console.log(' >>> pixInstallmentsOrder >>> ', pixInstallmentsOrder)
      console.log(' >>> pixInstallmentsOrder.customer >>> ', pixInstallmentsOrder.customer)
      console.log(" >>> pixInstallmentsOrder.status >>> ", pixInstallmentsOrder.status)
      console.log(" >>> pixInstallmentsOrder.transaction[doc.installment].status >>>", pixInstallmentsOrder.transaction[doc.installment].status)

      //if (pixInstallmentsOrder && pixInstallmentsOrder.status == 'pending' && pixInstallmentsOrder.transaction[doc.installment].status == 'pending') {
        if (pixInstallmentsOrder  && pixInstallmentsOrder.transaction[doc.installment].status == 'pending') {
        
        const success = false;

        const paymentBookMailgunTemplates = new PixInstallmentsMailgunTemplates(pixInstallmentsOrder);
        const dataEmail = paymentBookMailgunTemplates.mailgunPixInstallmentPending() //Aqui está chamando o email de cobrança de boleto
        console.log(' >>> dataEmail >>> ', dataEmail)

        console.log(' >>> Enviando o email >>> ')
        this.mailgunNotificationService.sendEmail(dataEmail)
        

        if (success) {
          doc.notification_status = 'sent'
          console.log(' >>> success >>> ')
        } else {
          doc.attempts = doc.attempts + 1
        }

        doc.save()
        console.log(doc)
      }
    }
  }

  // PIX -> CRON. -> Informa o usuário sobre o vencimento do pix.
  async searchForPendingNotificationsPix(maxRetry: number): Promise<void> {
    const filter = {
      notification_status: 'pending',
      attempts: { $lt: maxRetry },
      send_date: moment().startOf('hour').toDate(),
      order_type: 'pix'
    }

    const scheduleTasks = this.scheduledTaskService.findAll(filter)
    console.log('Running Pix...')
    for await (const doc of scheduleTasks) {
      const pixOrder = await this.pixOrderService.findOne(doc.external_id)

      if (pixOrder && pixOrder.transaction.status == 'pending') {
        const whatsapp = pixOrder.customer.whatsapp;
        const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

        // const pixNotificationTemplates = new PixNotificationTemplates(pixOrder);
        // const messages = pixNotificationTemplates.templatePixOrderPendingExpiring()

        // let success = true;
        // for await (const message of messages) {
          // if (success) {
            // success = await this.whatsappNotificationService.sendMessage(phone, message, doc.external_id, 'Env.Lembrete')
          // }
        // }

        // TODO: delete below after reactivate
        const success = false;

        const pixMailgunTemplates = new PixMailgunTemplates(pixOrder);
        const dataEmail = pixMailgunTemplates.mailgunPixOrderPending()

        this.mailgunNotificationService.sendEmail(dataEmail)

        if (success) {
          doc.notification_status = 'sent'
        } else {
          doc.attempts = doc.attempts + 1
        }
        
        doc.save()
        console.log(doc)
      }
    }
  }

  // BOLETO -> CRON. -> Informa o cancelamento do ingresso por não pagar o carnê.
  async searchForPaymentBookFailed(): Promise<void> {
    const today = moment()
    const sendDate = today
      .subtract(DAYS_AFTER_PAYMENT_BOOK_EXPIRED_TO_NOTIFICATE, 'days')
      .startOf('day')
      .toDate();

    const filter = {
      notification_status: 'sent',
      send_date: sendDate,
      order_type: 'payment-book'
    }

    const scheduleTasks = this.scheduledTaskService.findAll(filter)
    console.log('Running FailedPaymentBook')
    for await (const doc of scheduleTasks) {
      const paymentBookOrder = await this.paymentBookOrderService.findOne(doc.external_id)
      
      if (paymentBookOrder && paymentBookOrder.transactions[doc.installment].payment_date == null && paymentBookOrder.status == 'pending') {
        const whatsapp = paymentBookOrder.customer.whatsapp;
        const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

        // const paymentBookNotificationTemplates = new PaymentBookNotificationTemplates(paymentBookOrder);
        // const message = paymentBookNotificationTemplates.templatePaymentBookOrderInstallmentExpired()

        // const success = await this.whatsappNotificationService.sendMessage(phone, message, doc.external_id, 'Env.Boletos.failed')
        
        // TODO: delete below after reactivate
        const success = false;

        if (success) {
          paymentBookOrder.status = 'failed'
          await paymentBookOrder.save()
          doc.notification_status = 'send-and-no-paid'
          doc.save()
        }
      }
      console.log(doc)
    }
  }
}
