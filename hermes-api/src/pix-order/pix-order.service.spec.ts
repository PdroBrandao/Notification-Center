import { Test, TestingModule } from '@nestjs/testing';
import { PixOrderService } from './pix-order.service';

describe('PixOrderService', () => {
  let service: PixOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixOrderService],
    }).compile();

    service = module.get<PixOrderService>(PixOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
