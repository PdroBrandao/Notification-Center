import { Test, TestingModule } from '@nestjs/testing';
import { PaymentBookOrderController } from './payment-book-order.controller';
import { PaymentBookOrderService } from './payment-book-order.service';

describe('PaymentBookOrderController', () => {
  let controller: PaymentBookOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentBookOrderController],
      providers: [PaymentBookOrderService],
    }).compile();

    controller = module.get<PaymentBookOrderController>(PaymentBookOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
