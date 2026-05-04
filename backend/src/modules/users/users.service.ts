import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthProvider, User, UserDocument } from './schemas/user.schema';

export type CreatePhoneUserInput = {
  phone: string;
};

export type CreateGoogleUserInput = {
  googleId: string;
  email?: string;
  name?: string;
  profileImage?: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+refreshToken').exec();
  }

  findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).select('+googleId').exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+googleId').exec();
  }

  createPhoneUser(input: CreatePhoneUserInput): Promise<UserDocument> {
    return this.userModel.create({
      phone: input.phone,
      authProvider: AuthProvider.Phone,
      isPhoneVerified: false
    });
  }

  createGoogleUser(input: CreateGoogleUserInput): Promise<UserDocument> {
    return this.userModel.create({
      googleId: input.googleId,
      email: input.email,
      name: input.name,
      profileImage: input.profileImage,
      authProvider: AuthProvider.Google
    });
  }

  async linkGoogleUser(user: UserDocument, input: CreateGoogleUserInput): Promise<UserDocument> {
    user.googleId = input.googleId;
    user.email = input.email ?? user.email;
    user.name = user.name ?? input.name;
    user.profileImage = user.profileImage ?? input.profileImage;
    user.authProvider = AuthProvider.Google;

    return user.save();
  }

  async saveRefreshToken(userId: string, refreshTokenHash: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { refreshToken: refreshTokenHash }).exec();
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $unset: { refreshToken: '' } }).exec();
  }

  async saveOtp(userId: string, otpValidUntil: Date, otpHash?: string): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: userId },
        {
          otpHash,
          otpValidUntil,
          otpLastSentAt: new Date(),
          otpFailedAttempts: 0
        }
      )
      .exec();
  }

  findByPhoneWithOtp(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).select('+otpHash +otpValidUntil +otpLastSentAt +otpFailedAttempts').exec();
  }

  async incrementOtpFailedAttempts(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $inc: { otpFailedAttempts: 1 } }).exec();
  }

  async markPhoneVerified(userId: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          isPhoneVerified: true,
          $unset: {
            otpHash: '',
            otpValidUntil: '',
            otpLastSentAt: ''
          },
          otpFailedAttempts: 0
        },
        { new: true }
      )
      .exec();
  }
}
