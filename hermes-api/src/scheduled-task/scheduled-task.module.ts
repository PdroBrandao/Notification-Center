import { forwardRef, Module } from '@nestjs/common';
import { CronNotificationService } from './cron/cron-notification.service';
import { ScheduledTaskService } from './scheduled-task.service';
import { ScheduledTaskController } from './scheduled-task.controller';
import { ScheduledTask, ScheduledTaskSchema } from './entities/scheduled-task.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationCron } from './cron/notification.cron';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { PaymentBookOrderModule } from 'src/payment-book-order/payment-book-order.module';
import { PixOrderModule } from 'src/pix-order/pix-order.module';
import { PixInstallmentsModule } from 'src/pix-installments/pix-installments.module';
import { CreditCardOrderModule } from 'src/credit-card-order/credit-card-order.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ScheduledTask.name, schema: ScheduledTaskSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => PaymentBookOrderModule),
    forwardRef(() => PixInstallmentsModule),
    forwardRef(() => PixOrderModule),
    forwardRef(() => CreditCardOrderModule),
    forwardRef(() => MailgunNotificationModule),
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [ScheduledTaskController],
  providers: [CronNotificationService, ScheduledTaskService, NotificationCron],
  exports: [CronNotificationService, ScheduledTaskService]
})
export class ScheduledTaskModule {}
