import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardOrderService } from './credit-card-order.service';

describe('CreditCardOrderService', () => {
  let service: CreditCardOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditCardOrderService],
    }).compile();

    service = module.get<CreditCardOrderService>(CreditCardOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
