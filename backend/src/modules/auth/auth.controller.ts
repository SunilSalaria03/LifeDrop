import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { PhoneOtpSendDto } from './dto/phone-otp-send.dto';
import { PhoneOtpVerifyDto } from './dto/phone-otp-verify.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';

type AuthenticatedRequest = Request & {
  user: UserDocument;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  getHealth() {
    return this.authService.getHealth();
  }

  @Post('otp/send')
  sendPhoneOtp(@Body() phoneOtpSendDto: PhoneOtpSendDto) {
    return this.authService.sendPhoneOtp(phoneOtpSendDto);
  }

  @Post('otp/verify')
  verifyPhoneOtp(@Body() phoneOtpVerifyDto: PhoneOtpVerifyDto) {
    return this.authService.verifyPhoneOtp(phoneOtpVerifyDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('otp/verify-profile-phone')
  verifyProfilePhoneOtp(
    @Req() request: AuthenticatedRequest,
    @Body() phoneOtpVerifyDto: PhoneOtpVerifyDto,
  ) {
    return this.authService.verifyProfilePhoneOtp(
      request.user,
      phoneOtpVerifyDto,
    );
  }

  @Post('google')
  authenticateWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.authenticateWithGoogle(googleAuthDto);
  }

  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  logout(@Req() request: AuthenticatedRequest) {
    return this.authService.logout(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getMe(@Req() request: AuthenticatedRequest) {
    return this.authService.getMe(request.user);
  }
}
