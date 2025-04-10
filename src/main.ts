import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger API sənədləşdirməsi üçün konfiqurasiya
  const config = new DocumentBuilder()
    .setTitle('BYBER APP') // API sənədləşməsinin başlığı
    .setDescription('Bərbərlərin rezervasiya sistemi,müştərilərin idarəedilməsi və s.') // API təsviri
    .setVersion('1.0') // Versiya nömrəsi
    .addBearerAuth() // Bearer auth əlavə edir
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document); // Swagger UI üçün endpoint
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true, whitelist: true, stopAtFirstError: true })); // Qlobal validasiya aktivləşdirilir
  await app.listen(process.env.PORT ?? 3000); // Tətbiqi müəyyən portda işə salır
}
bootstrap();