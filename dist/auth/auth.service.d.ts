import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileDto } from './dto/update.profile.dto';
export declare class AuthService {
    private jwtService;
    private prismaservice;
    private configService;
    constructor(jwtService: JwtService, prismaservice: PrismaService, configService: ConfigService);
    private hashPassword;
    register(payload: AuthPayloadDto): Promise<{
        username: string;
    }>;
    login({ username, password }: AuthPayloadDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            username: string;
        };
    }>;
    logout(user: any): Promise<void>;
    refresh(userId: string): Promise<{
        accessToken: string;
    }>;
    updateUsername(userId: string, updateUsernameDto: UpdateUsernameDto): Promise<void>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<void>;
    deleteExpiredTokens(userId: string): Promise<void>;
    createRefreshToken(userId: string, token: string, expiry: Date): Promise<{}>;
}
