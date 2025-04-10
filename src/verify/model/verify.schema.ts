import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Verify {
    @Prop({ required: true })
    userEmail: string;
    @Prop({ required: true })
    code: number;
    @Prop({ expires: 300 })
    createdAt: Date;
}

export const verifyModel = SchemaFactory.createForClass(Verify);
