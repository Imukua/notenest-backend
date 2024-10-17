import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
  providers: [JournalsService],
  controllers: [JournalsController]
})
export class JournalsModule {}
