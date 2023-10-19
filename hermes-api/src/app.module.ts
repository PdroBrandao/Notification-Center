import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentBookOrderModule } from './payment-book-order/payment-book-order.module';
import { PixOrderModule } from './pix-order/pix-order.module';
import { ErrorLogModule } from './error-log/error-log.module';
import { CreditCardOrderModule } from './credit-card-order/credit-card-order.module';
import { WhatsappNotificationModule } from './whatsapp-notification/whatsapp-notification.module';
import { ResendNotificationModule } from './resend-notification/resend-notification.module';
import { MailgunNotificationModule } from './mailgun-notification/mailgun-notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTaskModule } from './scheduled-task/scheduled-task.module'
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { PixInstallmentsModule } from './pix-installments/pix-installments.module';
import { SendRemimberModule } from './send-remimber/send-remimber.module';

@Module({
  imports: [
    PaymentBookOrderModule,
    MongooseModule.forRoot(process.env.MONGO_URI,{
      useNewUrlParser: true,
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: true,
      environment: process.env.SENTRY_ENVIRONMENT,
      release: process.env.SENTRY_RELEASE || null,
      logLevels: ['error', 'warn','debug', 'log'],
    }),
    ScheduleModule.forRoot(),
    PixOrderModule,
    ErrorLogModule,
    CreditCardOrderModule,
    WhatsappNotificationModule,
    ResendNotificationModule,
    MailgunNotificationModule,
    ScheduledTaskModule,
    ConfigModule.forRoot(),
    AuthModule,
    PixInstallmentsModule,
    SendRemimberModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
