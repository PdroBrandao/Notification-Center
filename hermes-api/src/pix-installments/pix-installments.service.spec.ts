import { Test, TestingModule } from '@nestjs/testing';
import { PixInstallmentsService } from './pix-installments.service';

describe('PixInstallmentsService', () => {
  let service: PixInstallmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixInstallmentsService],
    }).compile();

    service = module.get<PixInstallmentsService>(PixInstallmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
