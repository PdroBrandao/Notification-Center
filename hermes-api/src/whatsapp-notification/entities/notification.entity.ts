import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PixOrderDocument = HydratedDocument<UserNotification>;

@Schema()
export class UserNotification {

    @Prop()
    status: string

    @Prop()
    to: string;

    @Prop()
    text: string

    @Prop()
    cod: string;

    @Prop()
    date: Date

    @Prop()
    external_id: string;
}

export const UserNotificationSchema =
    SchemaFactory.createForClass(UserNotification);
