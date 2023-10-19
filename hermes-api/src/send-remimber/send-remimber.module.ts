import { SendRemimbersService } from './send-remimber.service';
import { SendRemimberController } from './send-remimber.controller';
import { SendRemimberSchema, SendRemimber } from './entities/send-remimber.entity';

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WhatsappNotificationModule } from 'src/whatsapp-notification/whatsapp-notification.module';
import { MailgunNotificationModule } from 'src/mailgun-notification/mailgun-notification.module';

import { ErrorLogModule } from 'src/error-log/error-log.module';
import { ScheduledTaskModule } from 'src/scheduled-task/scheduled-task.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SendRemimber.name, schema: SendRemimberSchema }]),
    forwardRef(() => WhatsappNotificationModule),
    forwardRef(() => ScheduledTaskModule),
    forwardRef(() => MailgunNotificationModule),
    forwardRef(() => ErrorLogModule),
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [SendRemimberController],
  providers: [SendRemimbersService],
  exports: [SendRemimbersService]
})
export class SendRemimberModule {}
