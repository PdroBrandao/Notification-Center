import { Test, TestingModule } from '@nestjs/testing';
import { MailgunNotificationController } from './mailgun-notification.controller';
import { MailgunNotificationService } from './mailgun-notification.service';

describe('MailgunNotificationController', () => {
  let controller: MailgunNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailgunNotificationController],
      providers: [MailgunNotificationService],
    }).compile();

    controller = module.get<MailgunNotificationController>(MailgunNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
