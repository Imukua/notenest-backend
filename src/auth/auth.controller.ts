import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  register(@Body() body: AuthPayloadDto) {
    return this.authService.register(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    console.log(req.user);
    return this.authService.logout(req.user);
  }
  
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Body() body: refreshTokenDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.authService.refresh(user.id,body);
  }

  @Patch('username')
  @UseGuards(JwtAuthGuard) 
  async updateUsername(
    @Req() req: Request,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    const user = req.user as JwtPayload; 
    console.log(user); 
    
    // Extract user ID from the request
    await this.authService.updateUsername(user.id, updateUsernameDto);
    return HttpStatus.OK;
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard) // Protect this route
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = req.user as JwtPayload; //// Extract user ID from the request
    await this.authService.updatePassword(user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }

}