import { PartialType } from '@nestjs/mapped-types';
import { AdvertisementDto } from './create-advertisement.dto';

export class UpdateAdvertisementDto extends PartialType(AdvertisementDto) {}
