import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class User {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    profile_photo: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    surname: string;

    @Prop({ required: false })
    birthday: Date;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ unique: true })
    phone_num: string;

    @Prop({ required: false })
    gender: string;

    @Prop({ required: false })
    privacy_policy: boolean;

    @Prop({ required: true, ref: 'notification' })
    notificationIds: [mongoose.Schema.Types.ObjectId];

    @Prop({ required: true, ref: 'message' })
    messageIds: [mongoose.Schema.Types.ObjectId];

    @Prop({ required: true, ref: 'reservation' })
    reserveIds: [mongoose.Schema.Types.ObjectId];

    @Prop({ required: true, default: "user" })
    role: string
}

export const userModel = SchemaFactory.createForClass(User);
