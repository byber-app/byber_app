import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSelectedServiceDto } from 'src/selected services/dto/create-selected-service.dto';
import { SelectedService } from 'src/selected services/model/selected-service.schema';
import { tokenRequestBarberType } from './tokenReqType';
import { UpdateSelectedServiceDto } from 'src/selected services/dto/update-selected-service.dto';
import { Service, ServiceModel } from 'src/service/model/service.schema';
import { messageResponse } from 'src/auth/auth_type';
import { Barber } from './model/barber.schema';

@Injectable()
export class BarberService {
    constructor(@Inject(REQUEST) private readonly barber: tokenRequestBarberType,
        @InjectModel(SelectedService.name) private readonly selectedServiceModel: Model<SelectedService>,
        @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
        @InjectModel(Barber.name) private readonly barberModel: Model<Barber>,
    ) { }


    // Xidmətin İD -sinə uyğun alt xidmətləri gör
    async getSubServicesById(serviceId: string): Promise<SelectedService | null> {
        return this.selectedServiceModel.findById(serviceId);
    }


    // Ümumi xidmətləri əldə etmək üçün metod
    async getAllServices(): Promise<Service[]> {
        return this.serviceModel.find();
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


    // Bərbər xidmətini silir
    async deleteMyService(_id: string): Promise<SelectedService | messageResponse> {
        const deletedService = await this.selectedServiceModel.findByIdAndDelete(_id);
        if (!deletedService) {
            return { message: 'Xidmət tapılmadı' };
        }
        return deletedService;
    }


    // Bərbərləri görə bilir
    async getAllBarbers(): Promise<Barber[]> {
        return this.barberModel.find();
    }


    // Bərbər öz və digər bərbərlərin profilini görə bilir
    async getBarberProfile(barberId: string): Promise<Barber | messageResponse> {
        const barber = await this.barberModel.findById(barberId);
        if (!barber) {
            return { message: 'Bərbər tapılmadı' };
        }
        return barber;
    }


    // Bərbər xidmət növünə uyğun axtarış edə bilir məsələn: saç, saqqal, üz baxımı və s.
    // Filter edə bilir kateqoriya,reytinq və məsafə




}