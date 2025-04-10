import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class UserSignUpDto {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    surname: string;
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    birthday: Date;
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    password: string;
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsMobilePhone('az-AZ', { strictMode: false }, { message: 'Phone number must be in az-Az format' })
    @IsPhoneNumber('AZ')
    phone_num: string;
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    gender: string;
    @ApiProperty({ type: "boolean" })
    @IsBoolean()
    @IsNotEmpty()
    @Transform(({ value }) => value === 'true' || value === true)
    privacy_policy: boolean;
}
