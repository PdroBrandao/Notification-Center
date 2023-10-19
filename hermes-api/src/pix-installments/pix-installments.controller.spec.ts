import { Test, TestingModule } from '@nestjs/testing';
import { PixInstallmentsController } from './pix-installments.controller';
import { PixInstallmentsService } from './pix-installments.service';

describe('PixInstallmentsController', () => {
  let controller: PixInstallmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PixInstallmentsController],
      providers: [PixInstallmentsService],
    }).compile();

    controller = module.get<PixInstallmentsController>(PixInstallmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
