import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberModel } from 'src/barber/model/barber.schema';
import { User, userModel } from 'src/user/model/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { Verify } from 'crypto';
import { verifyModel } from 'src/verify/model/verify.schema';

@Module({
  imports: [JwtModule.register({ global: true }), MongooseModule.forFeature([{ name: User.name, schema: userModel },
  { name: Barber.name, schema: BarberModel }, { name: Verify.name, schema: verifyModel }])],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})

export class AuthModule { }
