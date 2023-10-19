import { Test, TestingModule } from '@nestjs/testing';
import { SendRemimberService } from './send-remimber.service';

describe('SendRemimberService', () => {
  let service: SendRemimberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendRemimberService],
    }).compile();

    service = module.get<SendRemimberService>(SendRemimberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
