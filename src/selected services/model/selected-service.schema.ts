import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class SelectedService extends Document {
    @Prop({ required: true })
    barberId: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true })
    serviceId: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true })
    subserviceId: mongoose.Schema.Types.ObjectId;;
    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    duration: number;
}

export const SelectedServiceModel = SchemaFactory.createForClass(SelectedService);
