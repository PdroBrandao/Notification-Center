import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument} from "mongoose";

export type ScheduledTaskDocument = HydratedDocument<ScheduledTask>;

@Schema()
export class ScheduledTask {
    @Prop()
    order_type: string;

    @Prop()
    order_id: string;

    @Prop()
    external_id: string;

    @Prop()
    notification_status: string;

    @Prop()
    send_date: Date;

    @Prop()
    attempts: number;

    @Prop()
    installment: number;
}

export const ScheduledTaskSchema = SchemaFactory.createForClass(ScheduledTask);