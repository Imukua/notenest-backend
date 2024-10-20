"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(jwtService, prismaservice, configService) {
        this.jwtService = jwtService;
        this.prismaservice = prismaservice;
        this.configService = configService;
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async register(payload) {
        const existingUser = await this.prismaservice.user.findUnique({
            where: {
                username: payload.username
            }
        });
        if (existingUser)
            throw new common_1.HttpException('User already exists', 400);
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
    async login({ username, password }) {
        const existingUser = await this.prismaservice.user.findUnique({
            where: {
                username: username
            }
        });
        if (!existingUser)
            return null;
        const isPasswordMatching = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isPasswordMatching) {
            throw new common_1.HttpException('Current password is incorrect', 400);
        }
        const { passwordHash, ...payload } = existingUser;
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
    async logout(user) {
        await this.prismaservice.refreshToken.deleteMany({
            where: {
                userId: user.id,
            },
        });
    }
    async refresh(userId) {
        const user = await this.prismaservice.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 400);
        }
        const { passwordHash, ...payload } = user;
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '15m',
        });
        return {
            accessToken
        };
    }
    async updateUsername(userId, updateUsernameDto) {
        const { newUsername } = updateUsernameDto;
        const existingUser = await this.prismaservice.user.findUnique({
            where: { username: newUsername },
        });
        if (existingUser) {
            throw new common_1.HttpException('Username already taken', 400);
        }
        await this.prismaservice.user.update({
            where: { id: userId },
            data: { username: newUsername },
        });
    }
    async updatePassword(userId, updatePasswordDto) {
        const { currentPassword, newPassword } = updatePasswordDto;
        const user = await this.prismaservice.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 400);
        }
        const isPasswordMatching = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordMatching) {
            throw new common_1.HttpException('Current password is incorrect', 400);
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prismaservice.user.update({
            where: { id: userId },
            data: { passwordHash: hashedNewPassword },
        });
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prismaservice.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 400);
        }
        const updateData = {};
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
    async deleteExpiredTokens(userId) {
        await this.prismaservice.refreshToken.deleteMany({
            where: {
                userId,
                expiry: {
                    lt: new Date(),
                },
            },
        });
    }
    async createRefreshToken(userId, token, expiry) {
        return this.prismaservice.refreshToken.create({
            data: {
                token,
                expiry,
                userId,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService, config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map