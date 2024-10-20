import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { AuthPayloadDto } from './dto/auth.dto';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { UpdateProfileDto } from './dto/update.profile.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refresh: jest.fn(),
            updateUsername: jest.fn(),
            updatePassword: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtRefreshGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return user data on successful login', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const req = { user: mockUser };
      expect(await controller.login(req as any)).toBe(mockUser);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockPayload: AuthPayloadDto = { username: 'newuser', password: 'password123' };
      const mockResult = { username: 'newuser' };
      jest.spyOn(authService, 'register').mockResolvedValue(mockResult);

      expect(await controller.register(mockPayload)).toBe(mockResult);
      expect(authService.register).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('logout', () => {
    it('should log out a user', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const req = { user: mockUser };
      await controller.logout(req as any);
      expect(authService.logout).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('refresh', () => {
    it('should refresh the access token', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const req = { user: mockUser };
      const mockResult = { accessToken: 'new_access_token' };
      jest.spyOn(authService, 'refresh').mockResolvedValue(mockResult);

      expect(await controller.refresh(req as any)).toBe(mockResult);
      expect(authService.refresh).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('updateUsername', () => {
    it('should update the username', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const req = { user: mockUser };
      const updateUsernameDto: UpdateUsernameDto = { newUsername: 'newusername' };
      
      await controller.updateUsername(req as any, updateUsernameDto);
      expect(authService.updateUsername).toHaveBeenCalledWith(mockUser.id, updateUsernameDto);
    });
  });

  describe('updatePassword', () => {
    it('should update the password', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const req = { user: mockUser };
      const updatePasswordDto: UpdatePasswordDto = { currentPassword: 'oldpass', newPassword: 'newpass' };
      
      await controller.updatePassword(req as any, updatePasswordDto);
      expect(authService.updatePassword).toHaveBeenCalledWith(mockUser.id, updatePasswordDto);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const req = { user: mockUser };
      const updateProfileDto: UpdateProfileDto = { username: 'newusername', password: 'newpassword' };
      
      await controller.updateProfile(req as any, updateProfileDto);
      expect(authService.updateProfile).toHaveBeenCalledWith(mockUser.id, updateProfileDto);
    });
  });
});
