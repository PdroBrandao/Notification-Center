import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Tickets {
  @Prop()
  ticket_name: string;

  @Prop()
  ticket_type: string;

  @Prop()
  ticket_url: string;
}

@Schema()
export class Transaction {
    @Prop()
    amount: string

    @Prop()
    status: string
}

@Schema()
export class Event {
    @Prop()
    name: string
    
    @Prop()
    date: string
    
    @Prop()
    time: string
    
    @Prop()
    city: string
    
    @Prop()
    state: string
    
    @Prop()
    tickets: [Tickets]
}

@Schema()
export class Whatsapp {
    @Prop()
    country_code: string;

    @Prop()
    number: string

    @Prop()
    area_code: string
}

@Schema()
export class Customer {
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    whatsapp: Whatsapp
}

export type CreditCardOrderDocument = HydratedDocument<CreditCardOrder>;

@Schema()
export class CreditCardOrder {
    @Prop()
    external_id: string;

    @Prop()
    customer: Customer;

    @Prop()
    event: Event

    @Prop()
    ruler: [boolean]

    @Prop()
    currency: string

    @Prop()
    transaction: Transaction
}

export const CreditCardOrderSchema = SchemaFactory.createForClass(CreditCardOrder);