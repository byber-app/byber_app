import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class BarberSignUpDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Ad boş ola bilməz.' })
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Soyad boş ola bilməz.' })
    surname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Doğum tarixi boş ola bilməz.' })
    birthday: Date;

    @ApiProperty()
    @IsEmail({}, { message: 'Email düzgün formatda olmalıdır.' })
    @IsNotEmpty({ message: 'Email boş ola bilməz.' })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Şifrə boş ola bilməz.' })
    @Length(8, 20, { message: 'Şifrə ən az 8, ən çox 20 simvol olmalıdır.' })
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Telefon nömrəsi boş ola bilməz.' })
    @IsMobilePhone('az-AZ', { strictMode: false }, { message: 'Telefon nömrəsi düzgün formatda olmalıdır.' })
    @IsPhoneNumber('AZ', { message: 'Telefon nömrəsi düzgün formatda olmalıdır.' })
    phone_num: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Cinsiyyət boş ola bilməz.' })
    gender: string;

    @ApiProperty()
    @IsString({ each: true })
    categories: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Ünvan boş ola bilməz.' })
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Mağaza adı boş ola bilməz.' })
    shop_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Mağazanın yeri boş ola bilməz.' })
    location: string;
}