import { PartialType } from '@nestjs/swagger';
import { CreatePixOrderDto } from './create-pix-order.dto';

export class UpdatePixOrderDto extends PartialType(CreatePixOrderDto) {}
