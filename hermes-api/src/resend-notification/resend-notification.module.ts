import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ErrorLogModule } from 'src/error-log/error-log.module';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ResendNotificationController } from './resend-notification.controller';
import { ResendNotificationService } from './resend-notification.service';

import { CreditCardOrder, CreditCardOrderSchema } from './../credit-card-order/entities/credit-card-order.entity';
import { PixOrder, PixOrderSchema } from './../pix-order/entities/pix-order.entity';
import { PaymentBookOrder, PaymentBookOrderSchema } from './../payment-book-order/entities/payment-book-order.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => MailgunNotificationModule),
    forwardRef(() => ErrorLogModule),
    MongooseModule.forFeature([{ name: CreditCardOrder.name, schema: CreditCardOrderSchema }]),
    MongooseModule.forFeature([{ name: PixOrder.name, schema: PixOrderSchema }]),
    MongooseModule.forFeature([{ name: PaymentBookOrder.name, schema: PaymentBookOrderSchema }]),
  ],
  controllers: [ResendNotificationController],
  providers: [ResendNotificationService],
  exports: [ResendNotificationService]
})
export class ResendNotificationModule { }
