import { Test, TestingModule } from '@nestjs/testing';
import { PaymentBookOrderService } from './payment-book-order.service';

describe('PaymentBookOrderService', () => {
  let service: PaymentBookOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentBookOrderService],
    }).compile();

    service = module.get<PaymentBookOrderService>(PaymentBookOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
