import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // 전역 Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // DTO에 없는 값은 자동 제거
      forbidNonWhitelisted: true, // DTO에 정의 안된 값 들어오면 에러
      transform: true,            // 타입 자동 변환 (string -> number 등)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
