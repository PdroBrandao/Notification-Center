import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ErrorLogService } from 'src/error-log/error-log.service';

import { WhatsappNotificationService } from 'src/whatsapp-notification/whatsapp-notification.service';
import { MailgunNotificationService } from 'src/mailgun-notification/mailgun-notification.service';

import { CreatePaymentBookOrderDto } from 'src/payment-book-order/dto/create-payment-book-order.dto';
import { PaymentBookMailgunTemplates } from 'src/mailgun-notification/models/payment-book_mailguntemplates';
import { PaymentBookNotificationTemplates } from 'src/whatsapp-notification/models/payment_book_notification_templates';
import { PaymentBookOrder, PaymentBookOrderDocument } from './../payment-book-order/entities/payment-book-order.entity';

import { CreatePixOrderDto } from 'src/pix-order/dto/create-pix-order.dto';
import { PixMailgunTemplates } from 'src/mailgun-notification/models/pix_mailguntemplates';
import { PixNotificationTemplates } from 'src/whatsapp-notification/models/pix_templates';
import { PixOrder, PixOrderDocument } from './../pix-order/entities/pix-order.entity';

import { CreateCreditCardOrderDto } from 'src/credit-card-order/dto/create-credit-card-order.dto';
import { CreditCardMailgunTemplates } from 'src/mailgun-notification/models/credit-card_mailguntemplates';
import { CreditCardNotificationTemplates } from 'src/whatsapp-notification/models/credit-card_notification_templates';
import { CreditCardOrder, CreditCardOrderDocument } from './../credit-card-order/entities/credit-card-order.entity';

import { BadRequestException } from "@nestjs/common";

@Injectable()
export class ResendNotificationService {
  constructor(
    @InjectModel(CreditCardOrder.name) private creditCardOrderModel: Model<CreditCardOrderDocument>,
    @InjectModel(PixOrder.name) private pixOrderModel: Model<PixOrderDocument>,
    @InjectModel(PaymentBookOrder.name) private paymentBookOrderModel: Model<PaymentBookOrderDocument>,
    private readonly errorLogService: ErrorLogService,
    private readonly whatsappNotificationService: WhatsappNotificationService,
    private readonly mailgunNotificationService: MailgunNotificationService,
  ) {}

  async resendTickets(paymentMethod: string, orderId: string) {
    switch(paymentMethod) {
      case 'credit_card':
        const creditCardOrder = await this.creditCardOrderModel.findOne({external_id: orderId}).exec();
        return this.resendCreditCardTickets(creditCardOrder, orderId);
      case 'pix':
        const pixOrder = await this.pixOrderModel.findOne({external_id: orderId}).exec();
        return this.resendPixTickets(pixOrder, orderId)
      case 'payment_book':
        const paymentBookOrder = await this.paymentBookOrderModel.findOne({external_id: orderId}).exec();
        return this.resendPaymentBookTickets(paymentBookOrder, orderId)
    }
  }

  createCreditCardOrder(createCreditCardOrderDto: CreateCreditCardOrderDto) {
    return new this.creditCardOrderModel(createCreditCardOrderDto);
  }

  createPixOrder(createPixOrderDto: CreatePixOrderDto) {
    return new this.pixOrderModel(createPixOrderDto)
  }

  createPaymentBookOrder(createPaymentBookOrderDto: CreatePaymentBookOrderDto) {
    return new this.paymentBookOrderModel(createPaymentBookOrderDto)
  }

  async resendCreditCardTickets(creditCardOrder: CreditCardOrder, orderId: string) {
    
    if (creditCardOrder) {
      const creditCardNotificationTemplates = new CreditCardNotificationTemplates(creditCardOrder);
      const creditCardNotificationTemplateMailGun = new CreditCardMailgunTemplates(creditCardOrder);

      const whatsapp = creditCardOrder.customer.whatsapp;
      const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

      const ticketEmail = creditCardNotificationTemplateMailGun.mailgunSendingTicketCreditCard()
      this.mailgunNotificationService.sendEmail(ticketEmail)
    
      const message = creditCardNotificationTemplates.templateCreditCardOrderPaid();
      this.whatsappNotificationService.sendMessage(phone, message, orderId, "Env.credit_card");

    } else {
      this.logError('Order not found in resendCreditCardTickets.', orderId);

      throw new BadRequestException('Something bad happened', {
        cause: new Error(), description: 'could not find an order for this external_id'
      });
    }
  }

  async resendPixTickets(pixOrder: PixOrder, orderId: string) {

    if (pixOrder) {

      const pixNotificationTemplates = new PixNotificationTemplates(pixOrder);
      const pixMailgunTemplates = new PixMailgunTemplates(pixOrder);

      const ticketEmail = pixMailgunTemplates.mailgunSendingTicketPix();
      this.mailgunNotificationService.sendEmail(ticketEmail);
  
      const whatsapp = pixOrder.customer.whatsapp;
      const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

      const message = pixNotificationTemplates.templatePixOrderPaid();
      this.whatsappNotificationService.sendMessage(phone, message, orderId, 'Env.CodePix')
      
    } else {
      this.logError('Order not found in resendPixTickets.', orderId);

      throw new BadRequestException('Something bad happened', {
        cause: new Error(), description: 'could not find an order for this external_id'
      });
    }
  }

  async resendPaymentBookTickets(paymentBookOrder: PaymentBookOrder, orderId: string) {    
    if (paymentBookOrder) {
      const whatsapp = paymentBookOrder.customer.whatsapp;
      const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;
  
      const paymentBookMailgunTemplates = new PaymentBookMailgunTemplates(paymentBookOrder);
      const paymentBookNotificationTemplates = new PaymentBookNotificationTemplates(paymentBookOrder);
  
      
      const dataEmail = paymentBookMailgunTemplates.mailgunSendingTicketPaymentBook()
      const paidEmail = paymentBookMailgunTemplates.mailgunDigitalBookletPaid()
  
      this.mailgunNotificationService.sendEmail(paidEmail)
      this.mailgunNotificationService.sendEmail(dataEmail)

      const message = paymentBookNotificationTemplates.templateResendPaymentBookOrderPaid()  
      this.whatsappNotificationService.sendMessage(phone, message, orderId, 'Conf.Pag.Boleto')

    } else {
      this.logError('Order not found in resendPaymentBookTickets.', orderId);

      throw new BadRequestException('Something bad happened', {
        cause: new Error(), description: 'could not find an order for this external_id'
      });
    }
  }

  async logError(errorMessage: string, external_id: string): Promise<void> {
    this.errorLogService.generateLog(external_id, errorMessage);
  }
}
