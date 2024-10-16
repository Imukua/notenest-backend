import { HttpException, Injectable } from '@nestjs/common';
import { Auth } from './auth';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private prismaservice: PrismaService) {}

    private async hashPassword(password: string): Promise<string> {
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds);
    }

    async register(payload: AuthPayloadDto) {    

      const existingUser = await this.prismaservice.user.findUnique({
        where: {
          username: payload.username
        }
      })
      if (existingUser) throw new HttpException('User already exists', 400);
  
      const hashedPassword = await this.hashPassword(payload.password); 
      const user = {
          username: payload.username,
          passwordHash: hashedPassword, 
      };
      const newUser = await this.prismaservice.user.create({
        data: user
      });
  
      const { passwordHash, ...safeUser } = user;
      return safeUser;
  }


    async login({username, password}: AuthPayloadDto) {
      const existingUser = await this.prismaservice.user.findUnique({
        where: {
          username: username
        }
      })

        if (!existingUser) return null;
        const isPasswordMatching = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isPasswordMatching) {
        throw new HttpException('Current password is incorrect', 400);
    }
        const{passwordHash , ...payload} = existingUser;

        const accessToken = this.jwtService.sign(payload, {
            secret: "process.env.JWT_ACCESS_TOKEN_SECRET",
            expiresIn: '15m',
          });
      
          const refreshToken = this.jwtService.sign(payload, {
            secret: "process.env.JWT_REFRESH_TOKEN_SECRET",
            expiresIn: '7d',
          });

          await this.deleteExpiredTokens(existingUser.id);

          await this.createRefreshToken(existingUser.id, refreshToken, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7));
          

      
          return {
            accessToken,
            refreshToken,
            user: {
              id: existingUser.id,
              username: existingUser.username,
            },
          };

    }

    async logout(user): Promise<void> {
      
      await this.prismaservice.refreshToken.deleteMany({
        where: {
          userId: user.id, 
        },
      });
    }

    async deleteExpiredTokens(userId: number): Promise<void> {
      await this.prismaservice.refreshToken.deleteMany({
        where: {
          userId,
          expiry: {
            lt: new Date(), 
          },
        },
      });
    }
  
    async createRefreshToken(userId: number, token: string, expiry: Date): Promise<{}> {
      return this.prismaservice.refreshToken.create({
        data: {
          token,
          expiry,
          userId,  
        },
      });
    }
}
