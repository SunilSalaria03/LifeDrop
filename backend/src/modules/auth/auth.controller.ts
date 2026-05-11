import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { PhoneOtpSendDto } from './dto/phone-otp-send.dto';
import { PhoneOtpVerifyDto } from './dto/phone-otp-verify.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';

type AuthenticatedRequest = Request & {
  user: UserDocument;
};

type CookieRequest = Request & {
  cookies?: Record<string, string | undefined>;
};

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('health')
  getHealth() {
    return this.authService.getHealth();
  }

  @Post('otp/send')
  sendPhoneOtp(@Body() phoneOtpSendDto: PhoneOtpSendDto) {
    return this.authService.sendPhoneOtp(phoneOtpSendDto);
  }

  @Post('otp/verify')
  async verifyPhoneOtp(
    @Body() phoneOtpVerifyDto: PhoneOtpVerifyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.verifyPhoneOtp(phoneOtpVerifyDto);
    this.setAuthCookies(response, authResponse.accessToken, authResponse.refreshToken);

    return { user: authResponse.user };
  }

  @UseGuards(JwtAuthGuard)
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
  async authenticateWithGoogle(
    @Body() googleAuthDto: GoogleAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse =
      await this.authService.authenticateWithGoogle(googleAuthDto);
    this.setAuthCookies(response, authResponse.accessToken, authResponse.refreshToken);

    return { user: authResponse.user };
  }

  @Post('refresh')
  async refreshTokens(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.refreshTokens(
      request.cookies?.[REFRESH_TOKEN_COOKIE],
    );
    this.setAuthCookies(response, authResponse.accessToken, authResponse.refreshToken);

    return { user: authResponse.user };
  }

  @Post('logout')
  async logout(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.clearAuthCookies(response);
    return this.authService.logoutByRefreshToken(
      request.cookies?.[REFRESH_TOKEN_COOKIE],
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() request: AuthenticatedRequest) {
    return this.authService.getMe(request.user);
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...this.getCookieOptions(),
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...this.getCookieOptions(),
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
  }

  private clearAuthCookies(response: Response) {
    const options = this.getCookieOptions();

    response.clearCookie(ACCESS_TOKEN_COOKIE, options);
    response.clearCookie(REFRESH_TOKEN_COOKIE, options);
  }

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    };
  }
}
