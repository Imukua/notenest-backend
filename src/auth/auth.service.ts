import { HttpException, Injectable } from '@nestjs/common';
import { Auth } from './auth';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { refreshTokenDto } from './dto/refresf.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileDto } from './dto/update.profile.dto';



@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private prismaservice: PrismaService, private configService: ConfigService) {}

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
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '15m',
          });
      
          const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
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

    async refresh(userId: string, body: refreshTokenDto){
      const {refreshToken} = body;
      const existingToken =  await this.prismaservice.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: userId
        }
      })

      if (!existingToken) {
        throw new HttpException('Invalid refresh token', 400);
      }

      const user = await this.prismaservice.user.findUnique({
        where: {
          id: userId
        } 
      })

      const { passwordHash, ...payload } = user;
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      })

      return {
        accessToken
      
    }
  }
    async updateUsername(userId: string,updateUsernameDto: UpdateUsernameDto): Promise<void> {
      const { newUsername } = updateUsernameDto;
  
      // Check if the new username is already taken
      const existingUser = await this.prismaservice.user.findUnique({
        where: { username: newUsername },
      });
  
      if (existingUser) {
        throw new HttpException('Username already taken', 400);
      }
  
      // Update the username
      await this.prismaservice.user.update({
        where: { id: userId },
        data: { username: newUsername },
      });
    }
  
    async updatePassword(userId: string,updatePasswordDto: UpdatePasswordDto): Promise<void> {
      const { currentPassword, newPassword } = updatePasswordDto;
  
      // Find the user
      const user = await this.prismaservice.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        throw new HttpException('User not found', 400);
      }
  
      // Check if the current password is correct
      const isPasswordMatching = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordMatching) {
        throw new HttpException('Current password is incorrect', 400);
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password
      await this.prismaservice.user.update({
        where: { id: userId },
        data: { passwordHash: hashedNewPassword },
      });
    }



    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<void> {
      const user = await this.prismaservice.user.findUnique({
        where: { id: userId },
      });
    
      if (!user) {
        throw new HttpException('User not found', 400);
      }
    
      const updateData: { username?: string; passwordHash?: string } = {};
    
      if (updateProfileDto.username) {
        updateData.username = updateProfileDto.username;
      }
    
      if (updateProfileDto.password) {
        const hashedNewPassword = await bcrypt.hash(updateProfileDto.password, 10);
        updateData.passwordHash = hashedNewPassword;
      }
    
      await this.prismaservice.user.update({
        where: { id: userId },
        data: updateData,
      });
    }
    
    async deleteExpiredTokens(userId: string): Promise<void> {
      await this.prismaservice.refreshToken.deleteMany({
        where: {
          userId,
          expiry: {
            lt: new Date(), 
          },
        },
      });
    }
  
    async createRefreshToken(userId: string, token: string, expiry: Date): Promise<{}> {
      return this.prismaservice.refreshToken.create({
        data: {
          token,
          expiry,
          userId,  
        },
      });
    }
}
