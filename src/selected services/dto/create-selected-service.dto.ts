import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateSelectedServiceDto {
    @ApiProperty()
    @IsNotEmpty()
    barberId: Types.ObjectId;
    @ApiProperty()
    @IsNotEmpty()
    serviceId: Types.ObjectId;
    @ApiProperty()
    @IsNotEmpty()
    subserviceId: Types.ObjectId;
    @ApiProperty()
    @IsNotEmpty()
    price: number;
    @ApiProperty()
    @IsNotEmpty()
    duration: number;
}