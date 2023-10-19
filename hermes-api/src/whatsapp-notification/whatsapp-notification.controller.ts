import { Controller } from '@nestjs/common';
import { WhatsappNotificationService } from './whatsapp-notification.service';

@Controller('whatsapp-notification')
export class WhatsappNotificationController {
  constructor(private readonly whatsappNotificationService: WhatsappNotificationService) {}
}
