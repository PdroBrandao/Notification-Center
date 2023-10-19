import { Test, TestingModule } from '@nestjs/testing';
import { PixOrderController } from './pix-order.controller';
import { PixOrderService } from './pix-order.service';

describe('PixOrderController', () => {
  let controller: PixOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PixOrderController],
      providers: [PixOrderService],
    }).compile();

    controller = module.get<PixOrderController>(PixOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
