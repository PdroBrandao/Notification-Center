import { Test, TestingModule } from '@nestjs/testing';
import { ResendNotificationService } from './resend-notification.service';

describe('ResendNotificationService', () => {
  let service: ResendNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResendNotificationService],
    }).compile();

    service = module.get<ResendNotificationService>(ResendNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
