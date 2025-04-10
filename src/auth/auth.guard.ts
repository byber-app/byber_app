import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { User } from 'src/user/model/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Authorization başlığından tokeni əldə edir
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token mövcud deyil'); // Əgər token yoxdursa, xəta qaytarır
    }

    try {
      // Tokeni yoxlayır və istifadəçi məlumatlarını çıxarır
      const decoded = this.jwtService.verify<User>(token);
      request.user = decoded; // İstifadəçi məlumatlarını sorğu obyektinə əlavə edir
    } catch (error) {
      throw new UnauthorizedException('Token düzgün deyil'); // Əgər token etibarsızdırsa, xəta qaytarır
    }
    return true; // Əgər hər şey qaydasındadırsa, giriş icazəsi verir
  }
}
