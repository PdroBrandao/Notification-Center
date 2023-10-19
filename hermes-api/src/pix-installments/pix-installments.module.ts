import { forwardRef, Module } from '@nestjs/common';
import { PixInstallmentsService } from './pix-installments.service';
import { PixInstallmentsController } from './pix-installments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PixInstallment, PixInstallmentSchema } from './entities/pix-installment.entity';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { ErrorLogModule } from 'src/error-log/error-log.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PixInstallment.name, schema: PixInstallmentSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => MailgunNotificationModule),
    forwardRef(() => ErrorLogModule),
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [PixInstallmentsController],
  providers: [PixInstallmentsService],
  exports: [PixInstallmentsService]
})
export class PixInstallmentsModule {}
