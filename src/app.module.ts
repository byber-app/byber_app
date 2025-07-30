import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BarberModule } from './barber/barber.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultdb'),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
  AuthModule, UserModule, BarberModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
