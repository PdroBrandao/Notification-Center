import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardOrderController } from './credit-card-order.controller';
import { CreditCardOrderService } from './credit-card-order.service';

describe('CreditCardOrderController', () => {
  let controller: CreditCardOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardOrderController],
      providers: [CreditCardOrderService],
    }).compile();

    controller = module.get<CreditCardOrderController>(CreditCardOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
