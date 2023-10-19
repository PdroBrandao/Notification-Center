import { PartialType } from '@nestjs/swagger';
import { CreatePaymentBookOrderDto } from './create-payment-book-order.dto';

export class UpdatePaymentBookOrderDto extends PartialType(CreatePaymentBookOrderDto) {}
