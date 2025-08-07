import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Subservice extends Document {
    @Prop({ required: true })
    serviceId: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    photo: string;
    @Prop({ default: true })
    active: boolean;
}

export const subserviceModel = SchemaFactory.createForClass(Subservice);