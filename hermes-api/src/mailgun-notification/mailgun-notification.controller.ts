import { Controller } from '@nestjs/common';
import { MailgunNotificationService } from './mailgun-notification.service';

@Controller('mailgun-notification')
export class MailgunNotificationController {
  constructor(private readonly mailgunNotificationService: MailgunNotificationService) {}
}
