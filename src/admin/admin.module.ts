import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, AdvertisementModel } from 'src/advertisement/model/advertisement.schema';
import { Service, ServiceModel } from 'src/service/model/service.schema';
import { Barber, BarberModel } from 'src/barber/model/barber.schema';
import { User, userModel } from 'src/user/model/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Advertisement.name, schema: AdvertisementModel },
    { name: Service.name, schema: ServiceModel },
    { name: Barber.name, schema: BarberModel },
    { name: User.name, schema: userModel },
  ])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
