import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CronNotificationService } from "./cron-notification.service";

const MAX_RETRY = 3
const EVERY_HOUR_BETWEEN_9AM_AND_6PM = "0 0-23/1 9-23 * * *" // Inicio de cada hora, de 9 às 23hrs
//const EVERY_HOUR_BETWEEN_9AM_AND_6PM = "* 7-23 * * *" // P/ teste. Todo minuto de 13 às 14hrs


@Injectable()
export class NotificationCron {
    constructor(
        private readonly cronNotificationService: CronNotificationService,
    ) {}

    @Cron(EVERY_HOUR_BETWEEN_9AM_AND_6PM, {timeZone: process.env.APP_TIMEZONE})
    async searchForPendingNotificationsPaymentBook(): Promise<void> {
        return this.cronNotificationService.searchForPendingNotificationsPaymentBook(MAX_RETRY);
    }

    @Cron(EVERY_HOUR_BETWEEN_9AM_AND_6PM, {timeZone: process.env.APP_TIMEZONE})
    async searchForPendingNotificationsPixInstallments(): Promise<void> {
        return this.cronNotificationService.searchForPendingNotificationsPixInstallments(MAX_RETRY);
    }

    @Cron(CronExpression.EVERY_HOUR, {timeZone: process.env.APP_TIMEZONE})
    async searchForPendingNotificationsPix(): Promise<void> {
        return this.cronNotificationService.searchForPendingNotificationsPix(MAX_RETRY);
    }

    @Cron(CronExpression.EVERY_DAY_AT_10AM, {timeZone: process.env.APP_TIMEZONE})
    async searchForPaymentBookFailed(): Promise<void> {
        return this.cronNotificationService.searchForPaymentBookFailed();
    }
}
