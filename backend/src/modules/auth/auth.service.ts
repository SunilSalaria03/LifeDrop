import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { OAuth2Client } from 'google-auth-library';
import { createHash } from 'node:crypto';
import { Twilio } from 'twilio';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { PhoneOtpSendDto } from './dto/phone-otp-send.dto';
import { PhoneOtpVerifyDto } from './dto/phone-otp-verify.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponse, AuthUser } from './interfaces/auth-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

const OTP_VALIDITY_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_FAILED_ATTEMPTS = 5;
const TWILIO_MAX_SEND_ATTEMPTS_CODE = 60203;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient = new OAuth2Client();
  private readonly twilioClient?: Twilio;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.initializeFirebaseAdmin();
    this.twilioClient = this.createTwilioClient();
  }

  getHealth() {
    return {
      module: 'auth',
      status: 'ready',
    };
  }

  async sendPhoneOtp(phoneOtpSendDto: PhoneOtpSendDto) {
    let user = await this.usersService.findByPhoneWithOtp(
      phoneOtpSendDto.phone,
    );

    if (!user) {
      user = await this.usersService.createPhoneUser({
        phone: phoneOtpSendDto.phone,
      });
    }

    this.assertCanLogin(user);
    this.assertCanResendOtp(user);
    const developmentOtp = await this.sendOtpSms(user.id, phoneOtpSendDto.phone);

    return {
      message: 'OTP sent successfully',
      ...(developmentOtp ? { otp: developmentOtp } : {}),
    };
  }

  async verifyPhoneOtp(
    phoneOtpVerifyDto: PhoneOtpVerifyDto,
  ): Promise<AuthResponse> {
    const user = await this.usersService.findByPhoneWithOtp(
      phoneOtpVerifyDto.phone,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Phone user does not exist. Please request OTP first.',
      );
    }

    this.assertCanLogin(user);
    await this.verifyTwilioOtp(user, phoneOtpVerifyDto.otp);
    const verifiedUser = await this.usersService.markPhoneVerified(user.id);

    if (!verifiedUser) {
      throw new UnauthorizedException(
        'Phone user does not exist. Please request OTP again.',
      );
    }

    return this.createAuthResponse(verifiedUser);
  }

  async verifyProfilePhoneOtp(
    currentUser: UserDocument,
    phoneOtpVerifyDto: PhoneOtpVerifyDto,
  ) {
    this.assertCanLogin(currentUser);

    const existingPhoneUser = await this.usersService.findByPhone(
      phoneOtpVerifyDto.phone,
    );

    if (existingPhoneUser && existingPhoneUser.id !== currentUser.id) {
      throw new BadRequestException(
        'Phone number is already used by another account.',
      );
    }

    const userWithOtp = await this.usersService.findByIdWithOtp(currentUser.id);

    if (!userWithOtp) {
      throw new UnauthorizedException('User does not exist.');
    }

    if (userWithOtp.phone !== phoneOtpVerifyDto.phone) {
      throw new BadRequestException(
        'Please save this phone number in your profile before verifying OTP.',
      );
    }

    await this.verifyTwilioOtp(userWithOtp, phoneOtpVerifyDto.otp);
    const verifiedUser = await this.usersService.markPhoneVerified(
      userWithOtp.id,
    );

    if (!verifiedUser) {
      throw new UnauthorizedException('User does not exist.');
    }

    return this.usersService.toSafeUser(verifiedUser);
  }

  async authenticateWithGoogle(
    googleAuthDto: GoogleAuthDto,
  ): Promise<AuthResponse> {
    const googleProfile = await this.verifyGoogleAuthToken(
      googleAuthDto.idToken,
    );
    let user = await this.usersService.findByGoogleId(googleProfile.googleId);

    if (!user && googleProfile.email) {
      user = await this.usersService.findByEmail(googleProfile.email);

      if (user) {
        user = await this.usersService.linkGoogleUser(user, googleProfile);
      }
    }

    if (!user) {
      user = await this.usersService.createGoogleUser(googleProfile);
    }

    this.assertCanLogin(user);

    return this.createAuthResponse(user);
  }

  private async verifyGoogleAuthToken(idToken: string) {
    const firebaseProfile = await this.verifyFirebaseGoogleToken(idToken);

    if (firebaseProfile) {
      return firebaseProfile;
    }

    return this.verifyGoogleOAuthToken(idToken);
  }

  private async verifyFirebaseGoogleToken(idToken: string) {
    if (getApps().length === 0) {
      return null;
    }

    const firebaseToken = await getAuth()
      .verifyIdToken(idToken)
      .catch(() => null);

    if (!firebaseToken) {
      return null;
    }

    const signInProvider = firebaseToken.firebase?.sign_in_provider;

    if (signInProvider !== 'google.com') {
      throw new UnauthorizedException(
        'Firebase token is not from Google sign-in.',
      );
    }

    return {
      googleId: firebaseToken.uid,
      email: firebaseToken.email,
      name: firebaseToken.name,
      profileImage: "https://picsum.photos/200",
    };
  }

  private async verifyGoogleOAuthToken(idToken: string) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    if (!googleClientId) {
      throw new BadRequestException('Google authentication is not configured.');
    }

    const ticket = await this.googleClient
      .verifyIdToken({
        idToken,
        audience: googleClientId,
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid Google ID token.');
      });

    const payload = ticket.getPayload();

    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid Google account payload.');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      profileImage: "https://picsum.photos/200",
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const refreshSecret = this.getRequiredConfig('JWT_REFRESH_SECRET');
    const payload = await this.jwtService
      .verifyAsync<JwtPayload>(refreshTokenDto.refreshToken, {
        secret: refreshSecret,
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token.');
      });

    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token is not active.');
    }

    this.assertCanLogin(user);

    if (this.hashToken(refreshTokenDto.refreshToken) !== user.refreshToken) {
      throw new UnauthorizedException(
        'Refresh token does not match active session.',
      );
    }

    return this.createAuthResponse(user);
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);

    return {
      message: 'Logged out successfully',
    };
  }

  getMe(user: UserDocument): AuthUser {
    return this.toAuthUser(user);
  }

  private async createAuthResponse(user: UserDocument): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role ?? UserRole.User,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.getRequiredConfig('JWT_ACCESS_SECRET'),
      expiresIn: this.getTokenExpiry('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.getRequiredConfig('JWT_REFRESH_SECRET'),
      expiresIn: this.getTokenExpiry('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    await this.usersService.saveRefreshToken(
      user.id,
      this.hashToken(refreshToken),
    );

    return {
      user: this.toAuthUser(user),
      accessToken,
      refreshToken,
    };
  }

  private toAuthUser(user: UserDocument): AuthUser {
    const isDonor = (user.role ?? UserRole.User) === UserRole.Donor;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: "https://picsum.photos/200",
      authProvider: user.authProvider,
      role: user.role ?? UserRole.User,
      phoneVerified: user.phoneVerified,
      isProfileCompleted: user.isProfileCompleted,
      isBlocked: user.isBlocked,
      addressText: isDonor ? user.addressText : undefined,
      bloodGroup: isDonor ? user.bloodGroup : undefined,
      gender: isDonor ? user.gender : undefined,
      birthDate: isDonor ? user.birthDate : undefined,
      weight: isDonor ? user.weight : undefined,
      lastDonationDate: isDonor ? user.lastDonationDate : undefined,
      showMobile: isDonor ? user.showMobile : undefined,
      smsAlert: isDonor ? user.smsAlert : undefined,
      pincode: user.pincode,
      state: user.state,
      city: user.city,
      district: user.district,
      tehsil: user.tehsil,
      location: user.location,
      createdAt: user.get('createdAt') as Date | undefined,
      updatedAt: user.get('updatedAt') as Date | undefined,
    };
  }

  private assertCanLogin(user: UserDocument) {
    if (user.isBlocked) {
      throw new ForbiddenException(
        'This account is blocked. Please contact support.',
      );
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private initializeFirebaseAdmin() {
    if (getApps().length > 0) {
      return;
    }

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    if (!projectId && !clientEmail && !privateKey) {
      return;
    }

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase Admin env values. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
      );
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  private createTwilioClient(): Twilio | undefined {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      return undefined;
    }

    return new Twilio(accountSid, authToken);
  }

  private async sendOtpSms(
    userId: string,
    phone: string,
  ): Promise<string | undefined> {
    const otp = this.generateOtp();
    const verifyServiceSid = this.configService.get<string>(
      'TWILIO_VERIFY_SERVICE_SID',
    );

    if (this.shouldUseDevelopmentOtp()) {
      this.logger.warn(`Development OTP for ${phone}: ${otp}`);
      await this.usersService.saveOtp(
        userId,
        this.getOtpValidUntil(),
        this.hashToken(otp),
      );
      return otp;
    }

    if (this.twilioClient && verifyServiceSid) {
      await this.twilioClient.verify.v2
        .services(verifyServiceSid)
        .verifications.create({
          to: phone,
          channel: 'sms',
        })
        .catch((error: unknown) => {
          this.handleTwilioError(error);
        });
      await this.usersService.saveOtp(userId, this.getOtpValidUntil());
      return undefined;
    }

    const fromPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    if (!this.twilioClient || !fromPhone) {
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        this.logger.warn(
          `Twilio is not configured. Development OTP for ${phone}: ${otp}`,
        );
        await this.usersService.saveOtp(
          userId,
          this.getOtpValidUntil(),
          this.hashToken(otp),
        );
        return otp;
      }

      throw new BadRequestException('Twilio OTP service is not configured.');
    }

    await this.twilioClient.messages
      .create({
        to: phone,
        from: fromPhone,
        body: `Your LifeDrop OTP is ${otp}.`,
      })
      .catch((error: unknown) => {
        this.handleTwilioError(error);
      });
    await this.usersService.saveOtp(
      userId,
      this.getOtpValidUntil(),
      this.hashToken(otp),
    );
    return undefined;
  }

  private async verifyTwilioOtp(
    user: UserDocument,
    otp: string,
  ): Promise<void> {
    const verifyServiceSid = this.configService.get<string>(
      'TWILIO_VERIFY_SERVICE_SID',
    );

    if (!user.otpValidUntil || user.otpValidUntil.getTime() < Date.now()) {
      throw new UnauthorizedException('OTP expired. Please request a new OTP.');
    }

    if (user.otpFailedAttempts >= OTP_MAX_FAILED_ATTEMPTS) {
      throw new UnauthorizedException(
        'Too many invalid OTP attempts. Please request a new OTP.',
      );
    }

    if (
      !this.shouldUseDevelopmentOtp() &&
      this.twilioClient &&
      verifyServiceSid &&
      user.phone
    ) {
      const verificationCheck = await this.twilioClient.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({
          to: user.phone,
          code: otp,
        })
        .catch((error: unknown) => {
          this.handleTwilioError(error);
        });

      if (verificationCheck.status !== 'approved') {
        await this.usersService.incrementOtpFailedAttempts(user.id);
        throw new UnauthorizedException('Invalid or expired OTP.');
      }

      return;
    }

    if (!user.otpHash) {
      throw new UnauthorizedException(
        'OTP session expired. Please request a new OTP.',
      );
    }

    if (this.hashToken(otp) !== user.otpHash) {
      await this.usersService.incrementOtpFailedAttempts(user.id);
      throw new UnauthorizedException('Invalid OTP.');
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpValidUntil(): Date {
    return new Date(Date.now() + OTP_VALIDITY_MS);
  }

  private shouldUseDevelopmentOtp(): boolean {
    return this.configService.get<string>('NODE_ENV') !== 'production';
  }

  private handleTwilioError(error: unknown): never {
    const twilioError = error as {
      status?: number;
      code?: number;
      message?: string;
    };

    if (
      twilioError.status === 429 ||
      twilioError.code === TWILIO_MAX_SEND_ATTEMPTS_CODE
    ) {
      throw new HttpException(
        'Maximum OTP send attempts reached. Please wait before requesting another OTP.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      twilioError.status &&
      twilioError.status >= 400 &&
      twilioError.status < 500
    ) {
      throw new BadRequestException(
        twilioError.message ?? 'Twilio rejected the OTP request.',
      );
    }

    throw new ServiceUnavailableException(
      'OTP service is temporarily unavailable. Please try again later.',
    );
  }

  private assertCanResendOtp(user: UserDocument): void {
    if (!user.otpLastSentAt) {
      return;
    }

    const elapsedMs = Date.now() - user.otpLastSentAt.getTime();

    if (elapsedMs < OTP_RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil(
        (OTP_RESEND_COOLDOWN_MS - elapsedMs) / 1000,
      );
      throw new BadRequestException(
        `Please wait ${waitSeconds} seconds before requesting another OTP.`,
      );
    }
  }

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(`Missing ${key}. Add it to backend/.env.`);
    }

    return value;
  }

  private getTokenExpiry(key: string, fallback: string) {
    return (this.configService.get<string>(key) ?? fallback) as never;
  }
}
