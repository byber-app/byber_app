import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdvertisementDto } from 'src/advertisement/dto/create-advertisement.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Advertisement } from 'src/advertisement/model/advertisement.schema';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { UpdateServiceDto } from 'src/service/dto/update-service.dto';
import { Service } from 'src/service/model/service.schema';


@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // Əlavə metodlar və endpoint-lər burada olacaq,
  // --------------------- Reklam metodları---------------------//

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




  @ApiOperation({ summary: 'Reklam statusunu dəyişmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması
  @Patch('dashboard/advertisement/:id/toggle-status')
  @HttpCode(HttpStatus.OK)
  async toggleAdvertisementStatus(@Param('id') _id: string): Promise<Advertisement> {
    return this.adminService.toggleAdvertisementStatus(_id);
  }


  @ApiOperation({ summary: 'Reklamları əldə etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması
  @ApiQuery({ name: 'active', required: false, description: 'Aktiv reklamları əldə etmək üçün true, deaktiv reklamları üçün false' })
  @Get('dashboard/advertisements/:active')
  @HttpCode(HttpStatus.OK)
  async getAdvertisements(@Query('active') active?: boolean): Promise<Advertisement[]> {
    return this.adminService.getAdvertisements(active);
  }


  @ApiOperation({ summary: 'Reklamı ID ilə əldə etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması  
  @Get('dashboard/advertisement/:id')
  @HttpCode(HttpStatus.OK)
  async getAdvertisementById(@Param('id') _id: string): Promise<Advertisement> {
    return this.adminService.getAdvertisementById(_id);
  }


  // --------------------- Xidmət metodları---------------------//

  @ApiOperation({ summary: "Xidmət yaratmaq" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object", properties: {
        name: { type: 'string', description: 'Xidmət adı', example: 'Xidmətin adı' },
        description: { type: 'string', description: 'Xidmət təsviri', example: 'Xidmətin təsviri' },
        price: { type: 'number', description: 'Xidmət qiyməti', example: 100 },
        photo: { type: 'string', format: 'binary', description: 'Xidmət üçün foto', },
      }
    }
  })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması
  @Post('dashboard/service')
  @HttpCode(HttpStatus.CREATED)
  async createService(@Body() serviceData: CreateServiceDto, @UploadedFile() photo: Express.Multer.File) {
    return this.adminService.createService(serviceData, photo);
  }


  @ApiOperation({ summary: 'Xidmətdə dəyişiklik etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması  
  @Patch('dashboard/service/:id')
  @HttpCode(HttpStatus.OK)
  async updateService(@Param('id') _id: string, @Body() serviceData: UpdateServiceDto, @UploadedFile() photo: Express.Multer.File) {
    return this.adminService.updateService(_id, serviceData, photo);
  }


  @ApiOperation({ summary: 'Xidmətləri əldə etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması
  @Get('dashboard/services')
  @HttpCode(HttpStatus.OK)
  async getServices(): Promise<Service[]> {
    return this.adminService.getAllServices();
  }


  @ApiOperation({ summary: 'Xidməti ID ilə əldə etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması  
  @Get('dashboard/service/:id')
  @HttpCode(HttpStatus.OK)
  async getServiceById(@Param('id') _id: string): Promise<Service> {
    return this.adminService.getServiceById(_id);
  }


  // --------------------- İstifadəçi və Bərbər statistikası---------------------//

  @ApiOperation({ summary: 'Bərbər istifadəçilərin sayını əldə etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması  
  @Get('dashboard/barber-count')
  @HttpCode(HttpStatus.OK)
  async getBarberCount(): Promise<number> {
    return this.adminService.getBarberCount();
  }


  @ApiOperation({ summary: 'Adi istifadəçilərin sayını əldə etmək' })
  @UseGuards(AuthGuard) // AuthGuard istifadə edərək admin yoxlaması
  @Get('dashboard/user-count')
  @HttpCode(HttpStatus.OK)
  async getUserCount(): Promise<number> {
    return this.adminService.getUserCount();
  }

}