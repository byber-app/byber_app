import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Advertisement {

    @Prop({ required: true })
    byberId: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: false })
    price?: number;
    @Prop({ required: false })
    discount?: number;
    @Prop({ required: true })
    photo: string;
    @Prop({ required: false, default: true })
    active?: boolean
}

export const AdvertisementModel = SchemaFactory.createForClass(Advertisement);