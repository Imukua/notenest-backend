import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT', 3000); // Default to 3000 if not set
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*'); // Default to all origins if not set

  app.enableCors({
    origin: ["https://notenestd.vercel.app"],
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
