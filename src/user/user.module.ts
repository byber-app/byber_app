import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userModel } from './model/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userModel }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
