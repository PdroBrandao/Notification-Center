import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ErrorLogDocument = HydratedDocument<ErrorLog>;

@Schema()
export class ErrorLog {
    @Prop()
    external_id: string;

    @Prop()
    order_id: string;

    @Prop()
    message: string;

    @Prop()
    created_at: Date
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);