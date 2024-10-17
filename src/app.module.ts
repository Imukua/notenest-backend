import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JournalsModule } from './journals/journals.module';

@Module({
  imports: [AuthModule, JournalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
