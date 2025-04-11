import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';


@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'İstifadəçi profili' })
  async getUserProfile(@Req() req) {
    return {
      user: req.user,
      message: 'İstifadəçi profili',
    }
  }
}
