import { PartialType } from '@nestjs/swagger';
import { CreatePixInstallmentDto } from './create-pix-installment.dto';

export class UpdatePixInstallmentDto extends PartialType(CreatePixInstallmentDto) {}
