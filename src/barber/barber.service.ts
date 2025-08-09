import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSelectedServiceDto } from 'src/selected services/dto/create-selected-service.dto';
import { SelectedService } from 'src/selected services/model/selected-service.schema';
import { tokenRequestBarberType } from './tokenReqType';
import { UpdateSelectedServiceDto } from 'src/selected services/dto/update-selected-service.dto';

@Injectable()
export class BarberService {
    constructor(@Inject(REQUEST) private readonly barber: tokenRequestBarberType,
        @InjectModel(SelectedService.name) private readonly selectedServiceModel: Model<SelectedService>
    ) { }


    // Xidmətin İD -sinə uyğun alt xidmətləri gör
    async getSubServicesById(serviceId: string): Promise<SelectedService | null> {
        return this.selectedServiceModel.findById(serviceId);
    }


    // bərbər özünə xidmətlər əlavə edə bilər
    async createMyService(CreateSelectedServiceData: CreateSelectedServiceDto): Promise<SelectedService> {
        const newService = await this.selectedServiceModel.create({
            ...CreateSelectedServiceData,
            barber: this.barber.barber._id, // Bərbərin ID-sini əlavə et
        });
        return newService;
    }


    // Əlavə edilən xidmətlərin yenilənməsi
    async updateMyService(_id: string, updateSelectedServiceData: UpdateSelectedServiceDto): Promise<SelectedService | null> {
        return this.selectedServiceModel.findByIdAndUpdate(_id, { $set: updateSelectedServiceData }, { new: true });
    }


    // Bərbərin xidmətləri
    async getMyServices(_id: string): Promise<SelectedService[]> {
        return this.selectedServiceModel.find({ barber: this.barber.barber._id });
    }


}