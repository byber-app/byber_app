import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SelectedService, SelectedServiceModel } from 'src/selected services/model/selected-service.schema';
import { Service, ServiceModel } from 'src/service/model/service.schema';
import { Barber, BarberModel } from './model/barber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SelectedService.name, schema: SelectedServiceModel },
   { name: Service.name, schema: ServiceModel }, { name: Barber.name, schema: BarberModel }])],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule { }
