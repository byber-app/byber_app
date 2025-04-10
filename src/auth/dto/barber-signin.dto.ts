import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class BarberSignInDto {
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
}
