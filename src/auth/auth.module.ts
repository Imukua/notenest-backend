import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Auth } from './auth';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategies/jwtrefresh.strategy';

@Module({
  imports: [
    JwtModule,
    PrismaModule,
    ConfigModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy]
}) 
export class AuthModule {}
