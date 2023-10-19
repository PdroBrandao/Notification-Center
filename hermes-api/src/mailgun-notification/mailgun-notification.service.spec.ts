import { Test, TestingModule } from '@nestjs/testing';
import { MailgunNotificationService } from './mailgun-notification.service';

describe('MailgunNotificationService', () => {
  let service: MailgunNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailgunNotificationService],
    }).compile();

    service = module.get<MailgunNotificationService>(MailgunNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
