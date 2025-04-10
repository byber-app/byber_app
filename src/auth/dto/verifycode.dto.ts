import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
    @ApiProperty()
    @IsNotEmpty()
    code: number;
}
