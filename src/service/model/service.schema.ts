import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Service extends mongoose.Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  gender: string;

}

export const ServiceModel = SchemaFactory.createForClass(Service);
