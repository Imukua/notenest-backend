import { HttpException, Injectable } from '@nestjs/common';
import { Auth } from './auth';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    constructor(private jwtService: JwtService) {}

    private async hashPassword(password: string): Promise<string> {
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds);
    }

    async register(payload: AuthPayloadDto) {
      const existingUser = fakeUsers.find(user => user.username === payload.username);
      if (existingUser) throw new HttpException('User already exists', 400);
  
      const hashedPassword = await this.hashPassword(payload.password);  // Hash the password
      const user = {
          id: fakeUsers.length + 1,
          username: payload.username,
          passwordHash: hashedPassword  // Use the hashed password here
      };
      console.log(user);
  
      fakeUsers.push(user);
      const { passwordHash, ...safeUser } = user;
      return safeUser;
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
