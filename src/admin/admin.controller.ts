import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdvertisementDto } from 'src/advertisement/dto/create-advertisement.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // Əlavə metodlar və endpoint-lər burada olacaq,

  @ApiOperation({ summary: 'Reklam yaratmaq' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object", properties: {
        title: { type: 'string', description: 'Reklam başlığı', example: 'Reklamın başlığı' },
        description: { type: 'string', description: 'Reklam təsviri', example: 'Reklamın təsviri' },
        price: { type: 'number', description: 'Reklam qiyməti', example: 100 },
        discount: { type: 'number', description: 'Reklam endirimi', example: 10 },
        photo: { type: 'string', format: 'binary', description: 'Reklam üçün foto', },

      }
    }
  })

  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması
  @Post('dashboard/advertisement')
  @HttpCode(HttpStatus.CREATED)
  async createAdvertisement(@Body() advertisementData: AdvertisementDto, @UploadedFile() photo: Express.Multer.File) {
    return this.adminService.createAdvertisement(advertisementData, photo);
  }

}
