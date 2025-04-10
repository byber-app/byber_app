import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema({ versionKey: false, timestamps: true })
export class Barber {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    profile_photo: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    surname: string;

    @Prop({ required: true })
    birthday: Date;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phone_num: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    shop_name: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    cover_photos: [mongoose.Schema.Types.ObjectId];

    @Prop({ required: true, default: 0 })
    star: number;

    @Prop({ required: false })
    about_me: string;

    @Prop({ required: false })
    dinner_time_start: string;

    @Prop({ required: false })
    dinner_time_finish: string;

    @Prop({ required: false })
    monday_friday_open: string;

    @Prop({ required: false })
    monday_friday_close: string;

    @Prop({ required: false })
    wp_link: string;

    @Prop({ required: false })
    fb_link: string;

    @Prop({ required: false })
    tiktok_link: string;

    @Prop({ required: false })
    inst_link: string;

    @Prop({ default: false })
    shop_active: boolean;

    @Prop({ required: true, ref: "service" })
    serviceIds: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: true, ref: "notification" })
    notificationIds: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: true, ref: "package" })
    packageIds: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: true, ref: "comment" })
    commentIds: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: true, ref: "message" })
    messageIds: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: true, ref: "reserve" })
    reserveIds: mongoose.Schema.Types.ObjectId[];
}

export const BarberModel = SchemaFactory.createForClass(Barber);