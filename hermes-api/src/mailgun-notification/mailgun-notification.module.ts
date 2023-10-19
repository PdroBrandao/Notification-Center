import { forwardRef, Module } from '@nestjs/common';
import { MailgunNotificationService } from './mailgun-notification.service';
import { MailgunNotificationController } from './mailgun-notification.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { PaymentBookOrderModule } from 'src/payment-book-order/payment-book-order.module';
import { PixOrderModule } from 'src/pix-order/pix-order.module';
import { CreditCardOrderModule } from 'src/credit-card-order/credit-card-order.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => PaymentBookOrderModule),
    forwardRef(() => PixOrderModule),
    forwardRef(() => CreditCardOrderModule)
  ],
  controllers: [MailgunNotificationController],
  providers: [MailgunNotificationService],
  exports: [MailgunNotificationService]
})
export class MailgunNotificationModule {}
