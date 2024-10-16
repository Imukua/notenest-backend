import { HttpException, Injectable } from '@nestjs/common';
import { Auth } from './auth';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUsers = [ 
    {
        id: 1,
        username: 'admin',
        passwordHash: 'admin'
    },
    {
        id: 2,
        username: 'user',
        passwordHash: 'user'
    }
];
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
    ) {}

    async register(payload: AuthPayloadDto) {
        const user = {
            id: fakeUsers.length + 1,
            username: payload.username,
            passwordHash: payload.password
        };
        const existingUser = fakeUsers.find(user => user.username === payload.username);
        if (existingUser) throw new HttpException('User already exists', 400);
        fakeUsers.push(user);
        return user;
    }
    
    async login({username, password}: AuthPayloadDto) {
        const user = fakeUsers.find(user => user.username === username && user.passwordHash === password);
        if (!user) return null;
        const{passwordHash , ...payload} = user;

        const accessToken = this.jwtService.sign(payload, {
            secret: "process.env.JWT_ACCESS_TOKEN_SECRET",
            expiresIn: '15m',
          });
      
          const refreshToken = this.jwtService.sign(payload, {
            secret: "process.env.JWT_REFRESH_TOKEN_SECRET",
            expiresIn: '7d',
          });


      
          return {
            accessToken,
            refreshToken,
            user: {
              id: user.id,
              username: user.username,
            },
          };
    }
}
