import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, versionKey: false })

export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  role: string;
}

export const NotificationModel = SchemaFactory.createForClass(Notification);
