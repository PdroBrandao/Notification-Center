import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailgunNotificationService } from 'src/mailgun-notification/mailgun-notification.service';
import { CreditCardMailgunTemplates } from 'src/mailgun-notification/models/credit-card_mailguntemplates';
import { ValidationsHelpers } from 'src/utils/validations';
import { CreditCardNotificationTemplates } from 'src/whatsapp-notification/models/credit-card_notification_templates';
import { WhatsappNotificationService } from 'src/whatsapp-notification/whatsapp-notification.service';
import { ErrorLogService } from "src/error-log/error-log.service";
import { CreateCreditCardOrderDto } from './dto/create-credit-card-order.dto';
import { UpdateCreditCardOrderDto } from './dto/update-credit-card-order.dto';
import { CreditCardOrder, CreditCardOrderDocument } from './entities/credit-card-order.entity';

@Injectable()
export class CreditCardOrderService {
  constructor(
    @InjectModel(CreditCardOrder.name) private CreditCardOrderModel: Model<CreditCardOrderDocument>,
    private readonly whatsappNotificationService: WhatsappNotificationService,
    private readonly mailgunNotificationService: MailgunNotificationService,
    private readonly errorLogService: ErrorLogService
  ) { }

  async create(createCreditCardOrderDto: CreateCreditCardOrderDto) {

    const previusCreditCardOrder = this.CreditCardOrderModel.find({
      external_id: createCreditCardOrderDto.external_id
    })

    try {
      await ValidationsHelpers.externalIdUniqueValidation(previusCreditCardOrder)
    } catch(e) {
      const response = e.response;
      this.errorLogService.generateLog(
        createCreditCardOrderDto.external_id,
        response.message + ' | ' + response.error
      );
      
      throw e;
    }

    const creditCardOrder = new this.CreditCardOrderModel(createCreditCardOrderDto);

    // ** WHATSAPP **
    // Formata número
    const whatsapp = creditCardOrder.customer.whatsapp;
    const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;

    // Seleciona a mensagem/Texto
    const creditCardNotificationTemplates = new CreditCardNotificationTemplates(creditCardOrder);
    const creditCardNotificationTemplateMailGun = new CreditCardMailgunTemplates(creditCardOrder)
    
    let message;
    let dataEmail;
    if (creditCardOrder.transaction.status == 'pending') {
      message = creditCardNotificationTemplates.templateCreditCardOrderPending();
      //dataEmail = creditCardNotificationTemplateMailGun.mailgunCreditCardOrder();

      // Dispara o email
      this.mailgunNotificationService.sendEmail(dataEmail)
    } else if (creditCardOrder.transaction.status == 'paid') {
      message = creditCardNotificationTemplates.templateCreditCardOrderPaid();
      // dataEmail = creditCardNotificationTemplateMailGun.mailgunConfirmationPayment()
      const ticketEmail = creditCardNotificationTemplateMailGun.mailgunSendingTicketCreditCard()

      // Dispara o email
      // this.mailgunNotificationService.sendEmail(dataEmail)
      this.mailgunNotificationService.sendEmail(ticketEmail)
    }
    
    // Dispara o Whatsapp
    this.whatsappNotificationService.sendMessage(phone, message, createCreditCardOrderDto.external_id, "Env.credit_card");

    return creditCardOrder.save();
  }

  findAll() {
    return this.CreditCardOrderModel.find()
  }

  findOne(external_id: string) {
    return this.CreditCardOrderModel.findOne({external_id: external_id})
  }

  async update(external_id: string, updateCreditCardOrderDto: UpdateCreditCardOrderDto) {

    const oldCreditCardOrder = await this.CreditCardOrderModel.findOne({external_id: external_id}).exec()
    if (oldCreditCardOrder) {
      const newCreditCardOrder = new this.CreditCardOrderModel(updateCreditCardOrderDto)

      const whatsapp = newCreditCardOrder.customer.whatsapp;
      const phone = `${whatsapp.country_code}${whatsapp.area_code}${whatsapp.number}`;
      const creditCardNotificationTemplates = new CreditCardNotificationTemplates(newCreditCardOrder);

      if (oldCreditCardOrder.transaction.status == 'pending' && newCreditCardOrder.transaction.status == 'paid') {
        const message = creditCardNotificationTemplates.templateCreditCardOrderPaid()
        this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.credit_card')

        const creditCardMailgunTemplates = new CreditCardMailgunTemplates(newCreditCardOrder);
        // const dataEmail = creditCardMailgunTemplates.mailgunConfirmationPayment();
        // this.mailgunNotificationService.sendEmail(dataEmail);

        const ticketEmail = creditCardMailgunTemplates.mailgunSendingTicketCreditCard();
        this.mailgunNotificationService.sendEmail(ticketEmail);
      }

      if (oldCreditCardOrder.transaction.status == 'pending' && newCreditCardOrder.transaction.status == 'failed') {
        const message = creditCardNotificationTemplates.templateCreditCardOrderFailed()
        this.whatsappNotificationService.sendMessage(phone, message, external_id, 'Env.credit_card')

        const creditCardMailgunTemplates = new CreditCardMailgunTemplates(newCreditCardOrder);
        const dataEmail = creditCardMailgunTemplates.mailgunRejectPayment();
        this.mailgunNotificationService.sendEmail(dataEmail);
      }
    }

    return this.CreditCardOrderModel.findOneAndUpdate(
      { external_id: external_id }, { $set: updateCreditCardOrderDto }, { new: true }
    );
  }

  remove(external_id: string) {
    return this.CreditCardOrderModel.deleteOne(
      {
        external_id: external_id
      }
    ).exec();
  }
}