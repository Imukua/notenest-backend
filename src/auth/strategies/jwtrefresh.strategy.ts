import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust based on your project structure
import { Request } from 'express';

export interface JwtPayload {
  id: string;
  username: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwtrefresh') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('bearer ', '');

    const userWithToken = await this.prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        refreshTokens: {
          where: { token: refreshToken }, 
        },
      },
    });

    if (!userWithToken || userWithToken.refreshTokens.length === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: userWithToken.id, username: userWithToken.username };
  }
}
