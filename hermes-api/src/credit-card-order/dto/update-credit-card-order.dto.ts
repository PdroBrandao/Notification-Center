import { PartialType } from '@nestjs/swagger';
import { CreateCreditCardOrderDto } from './create-credit-card-order.dto';

export class UpdateCreditCardOrderDto extends PartialType(CreateCreditCardOrderDto) {}
