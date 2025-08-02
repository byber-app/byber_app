import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Support extends mongoose.Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  priority: string;
}

export const SupportModel = SchemaFactory.createForClass(Support);
