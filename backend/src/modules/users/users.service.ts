import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonorProfile } from '../donors/schemas/donor-profile.schema';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  AuthProvider,
  User,
  UserDocument,
  UserRole,
} from './schemas/user.schema';

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
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(DonorProfile.name)
    private readonly donorProfileModel: Model<DonorProfile>,
  ) {}

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+refreshToken').exec();
  }

  findByIdWithOtp(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .select('+otpHash +otpValidUntil +otpLastSentAt +otpFailedAttempts')
      .exec();
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
      isPhoneVerified: false,
    });
  }

  createGoogleUser(input: CreateGoogleUserInput): Promise<UserDocument> {
    return this.userModel.create({
      googleId: input.googleId,
      email: input.email,
      name: input.name,
      profileImage: input.profileImage,
      authProvider: AuthProvider.Google,
    });
  }

  async linkGoogleUser(
    user: UserDocument,
    input: CreateGoogleUserInput,
  ): Promise<UserDocument> {
    user.googleId = input.googleId;
    user.email = input.email ?? user.email;
    user.name = user.name ?? input.name;
    user.profileImage = user.profileImage ?? input.profileImage;
    user.authProvider = AuthProvider.Google;

    return user.save();
  }

  async saveRefreshToken(
    userId: string,
    refreshTokenHash: string,
  ): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { refreshToken: refreshTokenHash })
      .exec();
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $unset: { refreshToken: '' } })
      .exec();
  }

  async saveOtp(
    userId: string,
    otpValidUntil: Date,
    otpHash?: string,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: userId },
        {
          otpHash,
          otpValidUntil,
          otpLastSentAt: new Date(),
          otpFailedAttempts: 0,
        },
      )
      .exec();
  }

  findByPhoneWithOtp(phone: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ phone })
      .select('+otpHash +otpValidUntil +otpLastSentAt +otpFailedAttempts')
      .exec();
  }

  async incrementOtpFailedAttempts(userId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $inc: { otpFailedAttempts: 1 } })
      .exec();
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
            otpLastSentAt: '',
          },
          otpFailedAttempts: 0,
        },
        { new: true },
      )
      .exec();
  }

  async updateProfile(user: UserDocument, dto: UpdateUserProfileDto) {
    if (user.isBlocked) {
      throw new ForbiddenException('Blocked users cannot update profiles.');
    }

    if ((dto.lat === undefined) !== (dto.lng === undefined)) {
      throw new BadRequestException(
        'Both lat and lng are required when updating user location.',
      );
    }

    const update: Record<string, unknown> = {};

    for (const field of [
      'name',
      'email',
      'phone',
      'profileImage',
      'addressText',
      'state',
      'city',
      'district',
    ] as const) {
      if (dto[field] !== undefined) {
        update[field] = dto[field];
      }
    }

    if (dto.lat !== undefined && dto.lng !== undefined) {
      update.location = {
        type: 'Point',
        coordinates: [Number(dto.lng), Number(dto.lat)],
      };
    }

    update.isProfileCompleted = Boolean(
      (dto.name ?? user.name) &&
      (dto.phone ?? user.phone) &&
      user.isPhoneVerified &&
      (dto.state ?? user.state) &&
      (dto.city ?? user.city),
    );

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user.id,
        { $set: update },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedUser) {
      throw new BadRequestException('User profile could not be updated.');
    }

    await this.syncDonorProfileFromUser(updatedUser, dto);

    return this.toSafeUser(updatedUser);
  }

  private async syncDonorProfileFromUser(
    user: UserDocument,
    dto: UpdateUserProfileDto,
  ): Promise<void> {
    if (user.role !== UserRole.Donor) {
      return;
    }

    const donorUpdate: Record<string, unknown> = {};

    for (const field of [
      'phone',
      'addressText',
      'state',
      'city',
      'district',
    ] as const) {
      if (dto[field] !== undefined) {
        donorUpdate[field] = dto[field];
      }
    }

    if (dto.lat !== undefined && dto.lng !== undefined) {
      donorUpdate.location = {
        type: 'Point',
        coordinates: [Number(dto.lng), Number(dto.lat)],
      };
    }

    if (Object.keys(donorUpdate).length === 0) {
      return;
    }

    await this.donorProfileModel
      .updateOne(
        { userId: user._id },
        { $set: donorUpdate },
        { runValidators: true },
      )
      .exec();
  }

  toSafeUser(user: UserDocument) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      role: user.role,
      isPhoneVerified: user.isPhoneVerified,
      isProfileCompleted: user.isProfileCompleted,
      isBlocked: user.isBlocked,
      addressText: user.addressText,
      state: user.state,
      city: user.city,
      district: user.district,
      location: user.location,
      createdAt: user.get('createdAt') as Date | undefined,
      updatedAt: user.get('updatedAt') as Date | undefined,
    };
  }
}
