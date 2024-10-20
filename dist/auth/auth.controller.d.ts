import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthPayloadDto } from './dto/auth.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { UpdateProfileDto } from './dto/update.profile.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: Request): Express.User;
    register(body: AuthPayloadDto): Promise<{
        username: string;
    }>;
    logout(req: Request): Promise<void>;
    refresh(req: Request): Promise<{
        accessToken: string;
    }>;
    updateUsername(req: Request, updateUsernameDto: UpdateUsernameDto): Promise<HttpStatus>;
    updatePassword(req: Request, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    updateProfile(req: Request, updateProfileDto: UpdateProfileDto): Promise<{
        message: string;
    }>;
}
