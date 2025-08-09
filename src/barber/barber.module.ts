import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SelectedService, SelectedServiceModel } from 'src/selected services/model/selected-service.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SelectedService.name, schema: SelectedServiceModel }])],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}
