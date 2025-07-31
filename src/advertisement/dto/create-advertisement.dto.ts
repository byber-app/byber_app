import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class AdvertisementDto {
    @ApiProperty()
    @IsNotEmpty()
    byberId: Types.ObjectId
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
    @ApiProperty()
    @IsOptional()
    price: number;
    @ApiProperty()
    @IsOptional()
    discount: number;
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    active: boolean;
}
