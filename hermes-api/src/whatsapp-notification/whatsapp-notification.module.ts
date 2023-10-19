import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { CreditCardOrderModule } from 'src/credit-card-order/credit-card-order.module';
import { ErrorLogModule } from 'src/error-log/error-log.module';
import { PaymentBookOrderModule } from 'src/payment-book-order/payment-book-order.module';
import { PixOrderModule } from 'src/pix-order/pix-order.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { WhatsappNotificationController } from './whatsapp-notification.controller';
import { WhatsappNotificationService } from './whatsapp-notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserNotification, UserNotificationSchema } from './entities/notification.entity';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => PaymentBookOrderModule),
    forwardRef(() => PixOrderModule),
    forwardRef(() => CreditCardOrderModule),
    forwardRef(() => ErrorLogModule),
    MongooseModule.forFeature([{ name: UserNotification.name, schema: UserNotificationSchema }]),
  ],
  controllers: [WhatsappNotificationController],
  providers: [WhatsappNotificationService],
  exports: [WhatsappNotificationService]
})
export class WhatsappNotificationModule { }
