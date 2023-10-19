import { forwardRef, Module } from '@nestjs/common';
import { PaymentBookOrderService } from './payment-book-order.service';
import { PaymentBookOrderController } from './payment-book-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentBookOrder, PaymentBookOrderSchema } from './entities/payment-book-order.entity';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { ErrorLogModule } from 'src/error-log/error-log.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PaymentBookOrder.name, schema: PaymentBookOrderSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => MailgunNotificationModule),
    forwardRef(() => ErrorLogModule),
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [PaymentBookOrderController],
  providers: [PaymentBookOrderService],
  exports: [PaymentBookOrderService]
})
export class PaymentBookOrderModule { }
