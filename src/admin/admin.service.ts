import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdvertisementDto } from 'src/advertisement/dto/create-advertisement.dto';
import { Advertisement } from 'src/advertisement/model/advertisement.schema';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<Advertisement>,
  ) {}

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
}
