import { forwardRef, Module } from '@nestjs/common';
import { PixOrderService } from './pix-order.service';
import { PixOrderController } from './pix-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PixOrder, PixOrderSchema } from './entities/pix-order.entity';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { ErrorLogModule } from 'src/error-log/error-log.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PixOrder.name, schema: PixOrderSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => MailgunNotificationModule),
    forwardRef(() => ErrorLogModule),
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [PixOrderController],
  providers: [PixOrderService],
  exports: [PixOrderService]
})
export class PixOrderModule {}
