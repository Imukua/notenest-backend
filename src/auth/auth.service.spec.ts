import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            refreshToken: {
              deleteMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { username: 'testuser', password: 'password123' };
      const mockCreatedUser = {
        id: '1',
        username: mockUser.username,
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockCreatedUser);

      const result = await service.register(mockUser);

      expect(result).toEqual({ username: mockUser.username });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: mockUser.username } });
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw an error if user already exists', async () => {
      const mockUser = { username: 'existinguser', password: 'password123' };
      const existingUser = {
        id: '1',
        username: mockUser.username,
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(existingUser);

      await expect(service.register(mockUser)).rejects.toThrow(HttpException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: mockUser.username } });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        passwordHash: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
      };
      const mockPayload = { username: 'testuser', password: 'password123' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock_token');
      jest.spyOn(service as any, 'createRefreshToken').mockResolvedValue({});

      const result = await service.login(mockPayload);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: mockPayload.username } });
    });

    it('should return null if user does not exist', async () => {
      const mockPayload = { username: 'nonexistentuser', password: 'password123' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.login(mockPayload);

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: mockPayload.username } });
    });

    it('should throw an error if password is incorrect', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        passwordHash: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
      };
      const mockPayload = { username: 'testuser', password: 'wrongpassword' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(service.login(mockPayload)).rejects.toThrow(HttpException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: mockPayload.username } });
    });
  });

  // Add more test cases for other methods like logout, refresh, updateUsername, updatePassword, etc.
});
