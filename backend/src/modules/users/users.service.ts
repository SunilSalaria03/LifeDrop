import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonorProfile } from '../donors/schemas/donor-profile.schema';
import { DonorProfileDocument } from '../donors/schemas/donor-profile.schema.types';
import type { AuthDonorProfile } from '../auth/interfaces/auth-response.interface';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  AuthProvider,
  User,
  UserRole,
} from './schemas/user.schema';
import { UserDocument } from './schemas/user.schema.types';
import { CreateGoogleUserInput, CreatePhoneUserInput } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(DonorProfile.name)
    private readonly donorProfileModel: Model<DonorProfileDocument>,
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
      phoneVerified: false,
    });
  }

  createGoogleUser(input: CreateGoogleUserInput): Promise<UserDocument> {
    return this.userModel.create({
      googleId: input.googleId,
      email: input.email,
      name: input.name,
      profileImage: input.profileImage,
      authProvider: AuthProvider.Google,
      phoneVerified: false,
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
          phoneVerified: true,
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
    const nextName = dto.name;
    const nextPhone = dto.phone;
    const isDonor = user.role === UserRole.Donor;

    for (const field of [
      'email',
      'profileImage',
      'pincode',
      'state',
      'city',
      'district',
      'tehsil',
    ] as const) {
      if (dto[field] !== undefined) {
        update[field] = dto[field];
      }
    }

    if (isDonor) {
      for (const field of [
        'addressText',
        'bloodGroup',
        'gender',
        'weight',
        'showMobile',
        'smsAlert',
      ] as const) {
        if (dto[field] !== undefined) {
          update[field] = dto[field];
        }
      }

      if (dto.birthDate !== undefined) {
        update.birthDate = new Date(dto.birthDate);
      }

      if (dto.lastDonationDate !== undefined) {
        update.lastDonationDate = new Date(dto.lastDonationDate);
      }
    }

    if (nextName !== undefined) {
      update.name = nextName;
    }

    if (nextPhone !== undefined) {
      update.phone = nextPhone;
    }

    if (dto.lat !== undefined && dto.lng !== undefined) {
      update.location = {
        type: 'Point',
        coordinates: [Number(dto.lng), Number(dto.lat)],
      };
    }

    update.isProfileCompleted = Boolean(
      (nextName ?? user.name) &&
      (nextPhone ?? user.phone) &&
      user.phoneVerified,
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

    return this.toSafeUserWithDonorProfile(updatedUser);
  }

  async toSafeUserWithDonorProfile(user: UserDocument) {
    const safeUser = this.toSafeUser(user);

    if (user.role !== UserRole.Donor) {
      return {
        ...safeUser,
        donorProfile: null,
      };
    }

    const donorProfile = await this.donorProfileModel
      .findOne({ userId: user._id })
      .exec();

    return {
      ...safeUser,
      donorProfile: donorProfile ? this.toSafeDonorProfile(donorProfile) : null,
    };
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
      'bloodGroup',
      'gender',
      'birthDate',
      'weight',
      'lastDonationDate',
      'showMobile',
      'smsAlert',
      'pincode',
      'state',
      'city',
      'district',
      'tehsil',
    ] as const) {
      if (dto[field] !== undefined) {
        donorUpdate[field] =
          field === 'lastDonationDate' || field === 'birthDate'
            ? new Date(dto[field])
            : dto[field];
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
    const isDonor = user.role === UserRole.Donor;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      role: user.role,
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

  private toSafeDonorProfile(donorProfile: DonorProfileDocument): AuthDonorProfile {
    return {
      id: donorProfile.id,
      userId: donorProfile.userId?.toString(),
      bloodGroup: donorProfile.bloodGroup,
      gender: donorProfile.gender,
      birthDate: donorProfile.birthDate,
      weight: donorProfile.weight,
      phone: donorProfile.phone,
      alternatePhone: donorProfile.alternatePhone,
      state: donorProfile.state,
      city: donorProfile.city,
      district: donorProfile.district,
      tehsil: donorProfile.tehsil,
      addressText: donorProfile.addressText,
      showMobile: donorProfile.showMobile,
      smsAlert: donorProfile.smsAlert,
      pincode: donorProfile.pincode,
      location: donorProfile.location,
      lastDonationDate: donorProfile.lastDonationDate,
      nextEligibleDate: donorProfile.nextEligibleDate,
      isAvailable: donorProfile.isAvailable,
      isActive: donorProfile.isActive,
      isVerified: donorProfile.isVerified,
      totalDonations: donorProfile.totalDonations,
      createdAt: donorProfile.get('createdAt') as Date | undefined,
      updatedAt: donorProfile.get('updatedAt') as Date | undefined,
    };
  }
}
