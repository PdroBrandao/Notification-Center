import { Test, TestingModule } from '@nestjs/testing';
import { SendRemimberController } from './send-remimber.controller';
import { SendRemimberService } from './send-remimber.service';

describe('SendRemimberController', () => {
  let controller: SendRemimberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendRemimberController],
      providers: [SendRemimberService],
    }).compile();

    controller = module.get<SendRemimberController>(SendRemimberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
