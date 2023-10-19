import { forwardRef, Module } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import { ErrorLogController } from './error-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorLog, ErrorLogSchema } from './entities/error-log.entity';
import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ErrorLog.name, schema: ErrorLogSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => MailgunNotificationModule),
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [ErrorLogController],
  providers: [ErrorLogService],
  exports: [ErrorLogService]
})
export class ErrorLogModule {}
