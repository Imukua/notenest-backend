import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  id: string;
  username: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwtrefresh') {
  constructor( private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.id, username: payload.username };
  }
}