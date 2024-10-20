import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JournalsModule } from './journals/journals.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
      isGlobal: true,
    }),
    AuthModule,
    JournalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
