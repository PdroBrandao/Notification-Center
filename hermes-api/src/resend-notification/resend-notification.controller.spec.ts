import { Test, TestingModule } from '@nestjs/testing';
import { ResendNotificationController } from './resend-notification.controller';
import { ResendNotificationService } from './resend-notification.service';

describe('ResendNotificationController', () => {
  let controller: ResendNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResendNotificationController],
      providers: [ResendNotificationService],
    }).compile();

    controller = module.get<ResendNotificationController>(ResendNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
