import { forwardRef, Module } from '@nestjs/common';
import { CreditCardOrderService } from './credit-card-order.service';
import { CreditCardOrderController } from './credit-card-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCardOrder, CreditCardOrderSchema } from './entities/credit-card-order.entity';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ErrorLogModule } from 'src/error-log/error-log.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CreditCardOrder.name, schema: CreditCardOrderSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => MailgunNotificationModule),
    forwardRef(() => ErrorLogModule),
    ConfigModule.forRoot(),
    AuthModule,
  ],
  controllers: [CreditCardOrderController],
  providers: [CreditCardOrderService]
})
export class CreditCardOrderModule {}
