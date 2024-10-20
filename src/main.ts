import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';


const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : [];
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true, 
  });
  await app.listen(3000);
}
bootstrap();
