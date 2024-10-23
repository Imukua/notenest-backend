import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { refreshTokenDto } from './dto/refresf.dto';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Return JWT tokens' })
  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @Post('register')
  async register(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.register(authPayloadDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }
  
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.authService.refresh(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('username') 
  async updateUsername(
    @Req() req: Request,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    const user = req.user as JwtPayload; 
    console.log(user); 
    
    await this.authService.updateUsername(user.id, updateUsernameDto);
    return HttpStatus.OK;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = req.user as JwtPayload; //// Extract user ID from the request
    await this.authService.updatePassword(user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user as JwtPayload; //// Extract user ID from the request
    await this.authService.updateProfile(user.id, updateProfileDto);
    return { message: 'Profile updated successfully' };
  }

}
