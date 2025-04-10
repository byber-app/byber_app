import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MulterOptions } from '../config/multer.config';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';
import { userSignInDto } from './dto/user-signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { BarberSignUpDto } from './dto/barber-signup.dto';
import { BarberSignInDto } from './dto/barber-signin.dto';
import { ResetPasswordDto } from './dto/resetpass.dto';
import { VerifyCodeDto } from './dto/verifycode.dto';
import { ForgetPassDto } from './dto/forgetpass.dto';
import { messageResponse } from './auth_type';

@ApiTags('auth') // Swagger-də "auth" kateqoriyası altında göstərilir
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('user/signup')
  @UseInterceptors(FileInterceptor('profile_photo', MulterOptions))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'İstifadəçi qeydiyyatı' }) // Endpointin qısa təsviri
  @ApiConsumes('multipart/form-data') // Fayl yükləmə üçün
  @ApiBody({
    description: 'Qeydiyyat üçün istifadəçi məlumatları və şəkil faylı',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John' },
        surname: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'password123' },
        birthday: { type: 'string', format: 'date', example: '1990-01-01' }, // Tarix formatı
        phone_num: { type: 'string', example: '+994501234567' }, // Telefon nömrəsi
        gender: { type: 'string', example: 'male' }, // Cinsiyyət
        privacy_policy: { type: 'boolean' }, // Məxfilik siyasəti
        profile_photo: {
          type: 'string',
          format: 'binary', // Fayl yükləmə üçün format
        },
      },
    },
  })
  async userSignup(@Body() userSignUpData: UserSignUpDto, @UploadedFile() file: Express.Multer.File): Promise<messageResponse> {
    return this.authService.userSignup(userSignUpData, file);
  }


  @Post('user/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'İstifadəçi girişi' }) // Endpointin qısa təsviri
  @ApiBody({
    description: 'Giriş üçün istifadəçi məlumatları',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  async userSignin(@Body() userSignInData: userSignInDto): Promise<{ accessToken: string; message: string }> {
    return this.authService.userSignin(userSignInData);
  }


  @Get('')
  @UseGuards(AuthGuard('google')) // GoogleAuthGuard istifadə olunur
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Google ilə giriş' }) // Endpointin qısa təsviri
  async googleAuth(@Req() req: any) {
    return { message: 'Google authentication' };
  }


  @Get('/google/callback')
  @UseGuards(AuthGuard('google')) // GoogleAuthGuard istifadə olunur {
  googleAuthCallback(@Req() req: any) {
    return this.authService.googleLogin(req.user); // Google-dan alınan istifadəçi məlumatları
  }


  @Post('/barber/signup')
  @UseInterceptors(FileInterceptor('profile_photo', MulterOptions))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bərbər qeydiyyatı' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Qeydiyyat üçün barber məlumatları və şəkil faylı',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Barber Name' },
        surname: { type: 'string', example: 'Barber Surname' },
        birthday: { type: 'string', format: 'date', example: '1990-01-01' },
        email: { type: 'string', example: 'barber@example.com' },
        password: { type: 'string', example: 'password123' },
        phone_num: { type: 'string', example: '+994501234567' },
        gender: { type: 'string', example: 'male' },
        address: { type: 'string', example: '123 Main St' },
        shop_name: { type: 'string', example: 'Barber Shop' },
        location: { type: 'string', example: 'Baku' },
        profile_photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async barberSignup(@Body() barberSignUpData: BarberSignUpDto, @UploadedFile() file: Express.Multer.File) {
    return await this.authService.barberSignup(barberSignUpData, file);
  }


  @Post('/barber/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bərbər girişi' })
  @ApiBody({
    description: 'Giriş üçün barber məlumatları',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'barber@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  async barberSignin(@Body() barberSignInData: BarberSignInDto): Promise<{ accessToken: string; message: string }> {
    return await this.authService.barberSignin(barberSignInData);
  }


  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifrəni unutmusunuz?' })
  @ApiBody({
    description: 'Şifrəni unutmuş istifadəçi üçün email',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john.doe@example.com' },
      },
    },
  })
  async forgetPassword(@Body() email: ForgetPassDto): Promise<{ message: string }> {
    return await this.authService.forgetPass(email);
  }



  @Post('/verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifrəni sıfırlamaq üçün kodu yoxlayın' })
  @ApiBody({
    description: 'Şifrəni sıfırlamaq üçün təsdiq kodu',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 1234 },
      },
    },
  })
  async verifyCode(@Body() code: VerifyCodeDto): Promise<{ message: string }> {
    return await this.authService.verifyCode(code);
  }



  @Post('/reset-password/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifrəni sıfırlayın' })
  @ApiBody({
    description: 'Yeni şifrə',
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'newpassword123' },
        repeat_password: { type: 'string', example: 'newpassword123' },
      },
    },
  })
  async resetPassword(@Param('token') token: string, @Body() resetPasswordData: ResetPasswordDto): Promise<{ message: string }> {
    return await this.authService.resetPassword(token, resetPasswordData);
  }


}