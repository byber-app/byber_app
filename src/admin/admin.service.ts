import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdvertisementDto } from 'src/advertisement/dto/advertisement.dto';
import { Advertisement } from 'src/advertisement/dto/advertisement.schema';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class AdminService {
    constructor(@InjectModel(Advertisement.name) private advertisementModel: Model<Advertisement>) { }


    async createAdvertisement(advertisementData: AdvertisementDto, photo: Express.Multer.File): Promise<{ message: string; advertisement: Advertisement }> {
        // Əgər bazada 10 aktiv reklam varsa, yeni reklam əlavə etmə
        const activeAdvertisementsCount = await this.advertisementModel.countDocuments({ active: true });
        if (activeAdvertisementsCount >= 10) {
            throw new Error('Maksimum aktiv reklam sayı 10-dur');
        }
        // Foto cloudinary yükləmə üçün
        const photoUrl = await cloudinary.uploader.upload(photo.path, { public_id: photo.originalname })
        const newAdvertisement = await this.advertisementModel.create({ ...advertisementData, photo: photoUrl.secure_url });
        return { message: 'Reklam uğurla yaradıldı', advertisement: newAdvertisement };
    }

}
