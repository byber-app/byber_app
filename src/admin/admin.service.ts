import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdvertisementDto } from 'src/advertisement/dto/create-advertisement.dto';
import { Advertisement } from 'src/advertisement/model/advertisement.schema';
import { Barber } from 'src/barber/model/barber.schema';
import cloudinary from 'src/config/cloudinary.config';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { Notification } from 'src/notification/model/notification.schema';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { UpdateServiceDto } from 'src/service/dto/update-service.dto';
import { Service } from 'src/service/model/service.schema';
import { Subservice } from 'src/subservice/model/subservice.schema';
import { Support } from 'src/support/model/support.schema';
import { User } from 'src/user/model/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Advertisement.name) private advertisementModel: Model<Advertisement>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(Barber.name) private barberModel: Model<Barber>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Support.name) private supportModel: Model<Support>,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Subservice.name) private subserviceModel: Model<Subservice>
  ) { }


  // --------------------- Reklam metodları---------------------//

  // Yeni reklam yaratmaq üçün metod
  async createAdvertisement(
    advertisementData: AdvertisementDto,
    photo: Express.Multer.File,
  ): Promise<{ message: string; advertisement: Advertisement }> {
    // Əgər bazada 10 aktiv reklam varsa, yeni reklam əlavə etmə
    const activeAdvertisementsCount =
      await this.advertisementModel.countDocuments({ active: true });
    if (activeAdvertisementsCount >= 10) {
      throw new Error('Maksimum aktiv reklam sayı 10-dur');
    }
    // Foto cloudinary yükləmə üçün
    const photoUrl = await cloudinary.uploader.upload(photo.path, {
      public_id: photo.originalname,
    });
    const newAdvertisement = await this.advertisementModel.create({
      ...advertisementData,
      photo: photoUrl.secure_url,
    });
    return {
      message: 'Reklam uğurla yaradıldı',
      advertisement: newAdvertisement,
    };
  }

  // Reklam statusu true olarsa yeniləndikdə false olsun və ya əksinə
  async toggleAdvertisementStatus(_id: string): Promise<Advertisement> {
    const advertisement = await this.advertisementModel.findById(_id);
    if (!advertisement) {
      throw new Error('Reklam tapılmadı');
    }
    if (advertisement.active === true) {
      advertisement.active = false;
      await advertisement.save();
    } else {
      advertisement.active = true;
      await advertisement.save();
    }
    return advertisement;
  }

  // Aktiv,passiv və ya bütün reklamları əldə etmək üçün metod
  async getAdvertisements(active?: boolean): Promise<Advertisement[]> {
    let query = {};
    if (active === true) query = { active: true };
    active === false ? (query = { active: false }) : null;
    return await this.advertisementModel.find(query);
  }

  // Reklamı ID görə əldə etmək üçün metod
  async getAdvertisementById(_id: string): Promise<Advertisement> {
    const advertisement = await this.advertisementModel.findById(_id);
    if (!advertisement) {
      throw new Error('Reklam tapılmadı');
    }
    return advertisement;
  }



  // --------------------- Xidmət metodları---------------------//


  // Yeni xidmət yaratmaq üçün metod
  async createService(serviceData: CreateServiceDto): Promise<{ message: string; service: Service }> {
    // Ada göre xidmətin olub olmadığını yoxlamaq
    const existingService = await this.serviceModel.findOne({ name: serviceData.name });
    if (existingService) {
      throw new Error('Bu adda xidmət artıq mövcuddur');
    }
    const newService = await this.serviceModel.create({
      ...serviceData
    });
    return {
      message: 'Xidmət uğurla yaradıldı',
      service: newService,
    };
  }


  // Xidmətdə dəyişiklik etmək üçün metod
  async updateService(_id: string, serviceData: UpdateServiceDto): Promise<{ message: string }> {
    const service = await this.serviceModel.findById(_id);
    if (!service) {
      throw new Error('Xidmət tapılmadı');
    }
    await this.serviceModel.findByIdAndUpdate(_id, { ...serviceData }, { new: true });
    return { message: 'Xidmət uğurla yeniləndi' };
  }


  // Xidməti ID görə əldə etmək üçün metod
  async getServiceById(_id: string): Promise<Service> {
    const service = await this.serviceModel.findById(_id);
    if (!service) {
      throw new Error('Xidmət tapılmadı');
    }
    return service;
  }


  // Bütün xidmətləri əldə etmək üçün metod
  async getAllServices(): Promise<Service[]> {
    return await this.serviceModel.find();
  }



  // --------------------- Alt xidmət metodları---------------------//







  // --------------------- Dəstək metodları---------------------//


  // Dəstəyi ID görə əldə etmək üçün metod
  async getSupportById(_id: string): Promise<Support> {
    const support = await this.supportModel.findById(_id);
    if (!support) {
      throw new Error('Dəstək tapılmadı');
    }
    return support;
  }


  // Bütün dəstəkləri əldə etmək üçün metod
  async getAllSupports(): Promise<Support[]> {
    return await this.supportModel.find();
  }



  // ---------------------  Bildiriş metodları---------------------//


  // Yeni bildiriş yaratmaq üçün metod
  async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
    const newNotification = await this.notificationModel.create(notificationData); // Yeni bildiriş yaradılır.
    return newNotification;
  }


  // Bütün bildirişləri əldə etmək üçün metod
  async getAllNotifications(): Promise<Notification[]> {
    return await this.notificationModel.find();
  }



  // --------------------- İstifadəçi və Bərbər statistikası---------------------//

  // Bərbər istifadəçilərin sayını əldə etmək üçün metod
  async getBarberCount(): Promise<number> {
    return await this.barberModel.find().countDocuments();
  }


  // Adi istifadəçilərin sayını əldə etmək üçün metod
  async getUserCount(): Promise<number> {
    return await this.userModel.find().countDocuments();
  }


}