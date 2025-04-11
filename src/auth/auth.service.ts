import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserSignUpDto } from 'src/auth/dto/user-signup.dto';
import { Barber } from 'src/barber/model/barber.schema';
import { User } from '../user/model/user.schema';
import { messageResponse } from './auth_type';
import { BarberSignInDto } from './dto/barber-signin.dto';
import { BarberSignUpDto } from './dto/barber-signup.dto';
import { userSignInDto } from './dto/user-signin.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Verify } from 'src/verify/model/verify.schema';
import { ResetPasswordDto } from './dto/resetpass.dto';
import { VerifyCodeDto } from './dto/verifycode.dto';
import { ForgetPassDto } from './dto/forgetpass.dto';
import cloudinary from 'src/config/cloudinary.config';


@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Barber.name) private readonly barberModel: Model<Barber>,
    @InjectModel(Verify.name) private readonly verifyModel: Model<Verify>,
    private readonly jwtService: JwtService, private readonly mailerService: MailerService) { }

  async userSignup(userSignUpData: UserSignUpDto, file: Express.Multer.File): Promise<messageResponse> {
    const { email, password, phone_num, ...rest } = userSignUpData;
    console.log(rest);
    console.log(phone_num);

    // Emailin unikal olub-olmadığını yoxlayır
    const existingUser = await this.userModel.findOne({ email, phone_num });
    if (existingUser) {
      throw new BadRequestException('Bu email və ya nömrə artıq istifadə olunur.');
    }

    // Şifrəni hash edir
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Şəkli Cloudinary-ə yükləyir
    const imageData = await cloudinary.uploader.upload(file.path, { public_id: file.originalname });
    console.log(imageData.secure_url);

    // Yeni istifadəçi yaradır
    await this.userModel.create({
      email, password: hashedPassword, phone_num, profile_photo: imageData.secure_url, ...rest,
    });
    return { message: "Qeydiyyat uğurla tamamlandı..." }

  }


  async userSignin(userSignInData: userSignInDto): Promise<{ accessToken: string, message: string }> {
    const { email, password } = userSignInData;
    // İstifadəçini email ilə tapır
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Email yanlışdır.');
    }

    // Şifrəni yoxlayır
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Şifrə yanlışdır.');
    }

    // Token yaradır
    const accessToken = this.jwtService.sign({ _id: user._id, email: user.email, role: user.role }, { secret: process.env.JWT_SECRET, expiresIn: "4h" });
    return { accessToken, message: "Giriş uğurla tamamlandı..." };
  }



  // Google ilə giriş
  async googleLogin(user: any): Promise<{ accessToken: string, message: string }> {
    const { email, name, surname, profile_photo, password } = user;
    // İstifadəçini email ilə tapır
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) {
      // Yeni istifadəçi yaradır
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userModel.create({
        email, name, surname, profile_photo, password: hashedPassword
      });
      const accessToken = this.jwtService.sign({ _id: newUser._id, email: newUser.email, role: newUser.role }, { secret: process.env.JWT_SECRET, expiresIn: "4h" });
      return { accessToken, message: "Google ilə qeydiyyat uğurla tamamlandı..." };
    } else {
      // Token yaradır
      const accessToken = this.jwtService.sign({ id: existingUser._id, email: existingUser.email, role: existingUser.role }, { secret: process.env.JWT_SECRET, expiresIn: "4h" });
      return { accessToken, message: "Google ilə giriş uğurla tamamlandı..." };
    }
  }

  // Barber istifadəçisi üçün qeydiyyat funksiyası
  async barberSignup(barberSignUpData: BarberSignUpDto, file: Express.Multer.File): Promise<messageResponse> {
    const userExists = await this.barberModel.findOne({ email: barberSignUpData.email, phone_num: barberSignUpData.phone_num });
    if (userExists) {
      throw new BadRequestException('Bu email və ya nömrə artıq istifadə olunur.');
    }
    if (!file) {
      const hashedPassword = await bcrypt.hash(barberSignUpData.password, 10);
      await this.barberModel.create({ ...barberSignUpData, password: hashedPassword });
      return { message: "Qeydiyyat uğurla tamamlandı..." };
    }
    // Şəkli Cloudinary-ə yükləyir
    const imageData = await cloudinary.uploader.upload(file.path, { public_id: file.originalname });
    const hashedPassword = await bcrypt.hash(barberSignUpData.password, 10);
    await this.barberModel.create({ ...barberSignUpData, password: hashedPassword, profile_photo: imageData.secure_url });
    return { message: "Qeydiyyat uğurla tamamlandı..." };
  }



  // Barber istifadəçisi üçün giriş funksiyası
  async barberSignin(barberSignInData: BarberSignInDto): Promise<{ accessToken: string, message: string }> {
    const { email, password } = barberSignInData;
    // İstifadəçini email ilə tapır
    const barber = await this.barberModel.findOne({ email });
    if (!barber) {
      throw new UnauthorizedException('Email yanlışdır.');
    }
    // Şifrəni yoxlayır
    const isPasswordValid = await bcrypt.compare(password, barber.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Şifrə yanlışdır.');
    }
    // Token yaradır
    const accessToken = this.jwtService.sign({ _id: barber._id, email: barber.email, role: barber.role }, { secret: process.env.JWT_SECRET, expiresIn: "4h" });
    return { accessToken, message: "Giriş uğurla tamamlandı..." };
  }


  // İstifadəçi şifrəsini unutduqda təsdiq kodu göndərir
  async forgetPass(forgetPass: ForgetPassDto): Promise<{ message: string }> {
    const { email } = forgetPass;
    // İstifadəçini email ilə tapır
    const user = await this.userModel.findOne({ email: email });
    const barber = await this.barberModel.findOne({ email: email });
    console.log(user);

    if (user) {
      // Təsdiq kodunu yaradır və email-ə göndərir
      const verificationCode = Math.floor(Math.random() * 10000);  // 4 rəqəmli təsdiq kodu yaradır
      await this.verifyModel.create({ userEmail: email, code: verificationCode });
      await this.mailerService.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is ${verificationCode}`,
      })

      return { message: "Təsdiq kodu email-ə göndərildi..." };
    }
    if (barber) {
      // Təsdiq kodunu yaradır və email-ə göndərir
      const verificationCode = Math.floor(Math.random() * 10000); // 4 rəqəmli təsdiq kodu yaradır
      await this.verifyModel.create({ userEmail: email, code: verificationCode });
      await this.mailerService.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is ${verificationCode}`,
      })

      return { message: "Təsdiq kodu email-ə göndərildi..." };
    } else {
      // İstifadəçi tapılmadısa, xəta atır
      throw new BadRequestException('Bu email ilə istifadəçi tapılmadı.');
    }

  }



  // Təsdiq kodunu yoxlayır
  async verifyCode(verify: VerifyCodeDto): Promise<{ message: string, token: string }> {
    // Təsdiq kodunu axtarır
    const verification = await this.verifyModel.findOne({ code: verify.code });
    if (!verification) {
      throw new BadRequestException('Təsdiq kodu yanlışdır.');
    }
    const token = this.jwtService.sign({ email: verification.userEmail }, { secret: process.env.JWT_SECRET, expiresIn: "4h" });
    return { message: "Təsdiq kodu uğurla təsdiqləndi...", token };
  }


  // Yeni şifrəni təyin edir
  async resetPassword(token: string, resetPasswordData: ResetPasswordDto): Promise<{ message: string }> {
    const { password, repeat_password } = resetPasswordData;
    // Tokeni yoxlayır
    if (!token) {
      throw new BadRequestException('Token mövcud deyil.');
    }
    // Tokeni deşifrə edir
    const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    if (!decodedToken) {
      throw new BadRequestException('Token yanlışdır.');
    }
    // Şifrəni yoxlayır
    if (password !== repeat_password) {
      throw new BadRequestException('Şifrələr uyğun gəlmir.');
    }
    const user = await this.userModel.findOne({ email: decodedToken.email });
    const barber = await this.barberModel.findOne({ email: decodedToken.email });
    if (!user && !barber) {
      throw new BadRequestException('İstifadəçi tapılmadı.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (user) {
      await this.userModel.findOneAndUpdate({ email: decodedToken.email }, { $set: { password: hashedPassword } });
    } else if (barber) {
      await this.barberModel.findOneAndUpdate({ email: decodedToken.email }, { $set: { password: hashedPassword } });
    }
    return { message: "Şifrə uğurla yeniləndi..." };
  }
}

