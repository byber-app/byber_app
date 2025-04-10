import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ResetPasswordDto {

    @ApiProperty({ description: 'Yeni şifrə' })
    @IsString({ message: 'Şifrə düzgün deyil' })
    password: string;

    @ApiProperty({ description: 'Təsdiq kodu' })
    @IsString({ message: 'Təsdiq kodu düzgün deyil' })
    repeat_password: string;
}