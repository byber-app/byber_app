import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSelectedServiceDto } from 'src/selected services/dto/create-selected-service.dto';
import { BarberService } from './barber.service';
import { UpdateSelectedServiceDto } from 'src/selected services/dto/update-selected-service.dto';
import { Service } from 'src/service/model/service.schema';

@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) { }


  @ApiOperation({ summary: 'Xidmətin ID-sinə uyğun alt xidmətləri gör' })
  @Post('sub-services/:serviceId')
  @HttpCode(HttpStatus.CREATED)
  async getSubServicesById(@Param('serviceId') serviceId: string) {
    return this.barberService.getSubServicesById(serviceId);
  }



  @ApiOperation({ summary: 'Bütün xidmətləri əldə et' })
  @Get('all-services')
  @HttpCode(HttpStatus.OK)
  async getAllServices(): Promise<Service[]> {
    return this.barberService.getAllServices();
  }


  @ApiOperation({ summary: 'Bərbər özünə xidmətlər əlavə edə bilər' })
  @Post('add-service')
  @HttpCode(HttpStatus.CREATED)
  async addService(@Body() createSelectedServiceData: CreateSelectedServiceDto) {
    return this.barberService.createMyService(createSelectedServiceData);
  }



  // Əlavə edilən xidmətlərin yenilənməsi
  @ApiOperation({ summary: 'Əlavə edilən xidmətlərin yenilənməsi' })
  @Patch('update-service/:_id')
  @HttpCode(HttpStatus.OK)
  async updateService(@Param('_id') _id: string, @Body() updateSelectedServiceData: UpdateSelectedServiceDto) {
    return this.barberService.updateMyService(_id, updateSelectedServiceData);
  }



  @ApiOperation({ summary: 'Bərbərin xidmətləri' })
  @Get('my-services')
  @HttpCode(HttpStatus.OK)
  async getMyServices(@Param('_id') _id: string) {
    return this.barberService.getMyServices(_id);
  }


  @ApiOperation({ summary: 'Bərbər xidmətini silir' })
  @Delete('delete-service/:_id')
  @HttpCode(HttpStatus.OK)
  async deleteService(@Param('_id') _id: string) {
    return this.barberService.deleteMyService(_id);
  }



  @ApiOperation({ summary: 'Bərbərləri görə bilir' })
  @Get('all-barbers')
  @HttpCode(HttpStatus.OK)
  async getAllBarbers() {
    return this.barberService.getAllBarbers();
  }


  @ApiOperation({ summary: 'Bərbərin profilini görmək' })
  @Get('barber-profile/:barberId')
  @HttpCode(HttpStatus.OK)
  async getBarberProfile(@Param('barberId') barberId: string) {
    return this.barberService.getBarberProfile(barberId);
  }

}
