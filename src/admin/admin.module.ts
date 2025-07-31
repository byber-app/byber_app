import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, AdvertisementModel } from 'src/advertisement/model/advertisement.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Advertisement.name, schema: AdvertisementModel }])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
