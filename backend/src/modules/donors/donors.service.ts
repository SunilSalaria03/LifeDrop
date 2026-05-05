import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateDonorProfileDto } from './dto/create-donor-profile.dto';
import { DonorSearchQueryDto } from './dto/donor-search-query.dto';
import { UpdateDonorAvailabilityDto } from './dto/update-donor-availability.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';
import {
  DonorProfile,
  DonorProfileDocument,
} from './schemas/donor-profile.schema';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';

const DONOR_ELIGIBILITY_DAYS = 90;
const DEFAULT_SEARCH_RADIUS_KM = 50;
const MAX_SEARCH_RADIUS_KM = 50;

type DonorProfileInput = CreateDonorProfileDto | UpdateDonorProfileDto;

@Injectable()
export class DonorsService {
  private readonly logger = new Logger(DonorsService.name);

  constructor(
    @InjectModel(DonorProfile.name)
    private readonly donorProfileModel: Model<DonorProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createProfile(user: UserDocument, dto: CreateDonorProfileDto) {
    this.assertUserCanManageDonorProfile(user);
    this.assertValidCoordinatePair(dto);
    const existingProfile = await this.donorProfileModel.exists({
      userId: user._id,
    });

    if (existingProfile) {
      throw new ConflictException(
        'Donor profile already exists for this user.',
      );
    }

    const profile = await this.donorProfileModel.create({
      ...this.toDonorProfileData(dto),
      userId: user._id,
      isActive: true,
      isVerified: false,
      totalDonations: 0,
    });

    await this.syncUserFromDonorProfile(user, profile);

    return profile;
  }

  async updateProfile(user: UserDocument, dto: UpdateDonorProfileDto) {
    this.assertUserCanManageDonorProfile(user);
    this.assertValidCoordinatePair(dto);
    const existingProfile = await this.donorProfileModel
      .findOne({ userId: user._id })
      .exec();

    if (!existingProfile) {
      throw new NotFoundException(
        'Donor profile does not exist for this user.',
      );
    }

    const updateData = this.toDonorProfileData(dto);
    const updatedProfile = await this.donorProfileModel
      .findOneAndUpdate({ userId: user._id }, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException(
        'Donor profile does not exist for this user.',
      );
    }

    await this.syncUserFromDonorProfile(user, updatedProfile);
    return updatedProfile;
  }

  async getMyProfile(user: UserDocument) {
    return this.donorProfileModel.findOne({ userId: user._id }).exec();
  }

  async updateAvailability(
    user: UserDocument,
    dto: UpdateDonorAvailabilityDto,
  ) {
    this.assertUserCanManageDonorProfile(user);
    const profile = await this.donorProfileModel
      .findOneAndUpdate(
        { userId: user._id },
        {
          isAvailable: dto.isAvailable,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!profile) {
      throw new NotFoundException(
        'Donor profile does not exist for this user.',
      );
    }

    return profile;
  }

  async search(query: DonorSearchQueryDto) {
    this.assertValidSearchMode(query);
    const radiusKm = this.normalizeRadiusKm(query.radiusKm);

    const baseFilter = this.buildEligibleFilter(query);
    const pipeline = this.hasGeoSearch(query)
      ? this.buildGeoSearchPipeline(query, radiusKm, baseFilter)
      : this.buildManualSearchPipeline(baseFilter);

    this.logSearchDebug(query, radiusKm, baseFilter, pipeline);

    const items = await this.donorProfileModel.aggregate(pipeline).exec();

    return {
      items,
      count: items.length,
      radiusKm,
    };
  }

  async getPublicProfile(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid donor profile id.');
    }

    const [profile] = await this.donorProfileModel
      .aggregate(this.buildPublicProfilePipeline(id))
      .exec();

    if (!profile) {
      throw new NotFoundException('Donor profile not found.');
    }

    return profile;
  }

  private toDonorProfileData(dto: DonorProfileInput) {
    const data: Record<string, unknown> = { ...dto };

    if (dto.lat !== undefined && dto.lng !== undefined) {
      data.location = {
        type: 'Point',
        coordinates: [Number(dto.lng), Number(dto.lat)],
      };
    }

    delete data.lat;
    delete data.lng;

    if (dto.lastDonationDate !== undefined) {
      const lastDonationDate = new Date(dto.lastDonationDate);
      data.lastDonationDate = lastDonationDate;
      data.nextEligibleDate = this.getNextEligibleDate(lastDonationDate);
    }

    return data;
  }

  private getNextEligibleDate(lastDonationDate: Date): Date {
    const nextEligibleDate = new Date(lastDonationDate);
    nextEligibleDate.setDate(
      nextEligibleDate.getDate() + DONOR_ELIGIBILITY_DAYS,
    );
    return nextEligibleDate;
  }

  private async syncUserFromDonorProfile(
    user: UserDocument,
    profile: DonorProfileDocument,
  ): Promise<void> {
    const update: Record<string, unknown> = {};

    if (!user.phone && profile.phone) {
      update.phone = profile.phone;
    }

    for (const field of ['state', 'city', 'district', 'addressText'] as const) {
      if (profile[field] !== undefined) {
        update[field] = profile[field];
      }
    }

    if (profile.location) {
      update.location = profile.location;
    }

    update.isProfileCompleted = Boolean(
      user.name &&
        (user.phone ?? profile.phone) &&
        user.isPhoneVerified &&
        profile.state &&
        profile.city,
    );
    update.role = UserRole.Donor;

    await this.userModel.updateOne({ _id: user._id }, { $set: update }).exec();
  }

  private assertUserCanManageDonorProfile(user: UserDocument): void {
    if (user.isBlocked) {
      throw new ForbiddenException(
        'Blocked users cannot manage donor profiles.',
      );
    }

    if (!user.isProfileCompleted) {
      throw new ForbiddenException(
        'Complete your profile before managing donor profiles.',
      );
    }
  }

  private assertValidSearchMode(query: DonorSearchQueryDto): void {
    if ((query.lat === undefined) !== (query.lng === undefined)) {
      throw new BadRequestException(
        'Both lat and lng are required for geo search.',
      );
    }

    if (query.lat !== undefined && !Number.isFinite(Number(query.lat))) {
      throw new BadRequestException('lat must be a valid number.');
    }

    if (query.lng !== undefined && !Number.isFinite(Number(query.lng))) {
      throw new BadRequestException('lng must be a valid number.');
    }

    if (
      query.lat !== undefined &&
      (Number(query.lat) < -90 || Number(query.lat) > 90)
    ) {
      throw new BadRequestException('lat must be between -90 and 90.');
    }

    if (
      query.lng !== undefined &&
      (Number(query.lng) < -180 || Number(query.lng) > 180)
    ) {
      throw new BadRequestException('lng must be between -180 and 180.');
    }

    if (
      !this.hasGeoSearch(query) &&
      !query.state &&
      !query.city &&
      !query.district
    ) {
      throw new BadRequestException(
        'Provide lat/lng or at least one location filter.',
      );
    }
  }

  private normalizeRadiusKm(radiusKm?: number): number {
    const normalizedRadius = radiusKm ?? DEFAULT_SEARCH_RADIUS_KM;

    if (!Number.isFinite(Number(normalizedRadius))) {
      throw new BadRequestException('radiusKm must be a valid number.');
    }

    if (normalizedRadius < 1) {
      throw new BadRequestException('radiusKm must be at least 1.');
    }

    if (normalizedRadius > MAX_SEARCH_RADIUS_KM) {
      throw new BadRequestException(
        `radiusKm must be less than or equal to ${MAX_SEARCH_RADIUS_KM}.`,
      );
    }

    return Number(normalizedRadius);
  }

  private assertValidCoordinatePair(dto: DonorProfileInput): void {
    if ((dto.lat === undefined) !== (dto.lng === undefined)) {
      throw new BadRequestException(
        'Both lat and lng are required when updating donor coordinates.',
      );
    }
  }

  private hasGeoSearch(
    query: DonorSearchQueryDto,
  ): query is DonorSearchQueryDto & { lat: number; lng: number } {
    return query.lat !== undefined && query.lng !== undefined;
  }

  private buildEligibleFilter(query: DonorSearchQueryDto) {
    const now = new Date();
    const filter: Record<string, unknown> = {
      bloodGroup: query.bloodGroup,
      isActive: true,
      isAvailable: true,
      $or: [
        { nextEligibleDate: { $lte: now } },
        { nextEligibleDate: null },
        { nextEligibleDate: { $exists: false } },
      ],
    };

    if (query.state) {
      filter.state = query.state;
    }

    if (query.city) {
      filter.city = query.city;
    }

    if (query.district) {
      filter.district = query.district;
    }

    return filter;
  }

  private buildGeoSearchPipeline(
    query: DonorSearchQueryDto & { lat: number; lng: number },
    radiusKm: number,
    baseFilter: Record<string, unknown>,
  ): PipelineStage[] {
    return [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(query.lng), Number(query.lat)],
          },
          distanceField: 'distanceMeters',
          maxDistance: radiusKm * 1000,
          spherical: true,
          query: baseFilter,
        },
      },
      ...this.userLookupStages(),
      {
        $addFields: {
          distanceKm: {
            $round: [{ $divide: ['$distanceMeters', 1000] }, 2],
          },
        },
      },
      {
        $sort: {
          distanceMeters: 1,
        },
      },
      ...this.safeDonorProjectionStages(),
    ];
  }

  private logSearchDebug(
    query: DonorSearchQueryDto,
    radiusKm: number,
    baseFilter: Record<string, unknown>,
    pipeline: PipelineStage[],
  ): void {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    this.logger.debug(
      JSON.stringify(
        {
          message: 'Donor geo/manual search debug',
          query,
          radiusKm,
          baseFilter,
          pipeline,
        },
        null,
        2,
      ),
    );
  }

  private buildManualSearchPipeline(
    baseFilter: Record<string, unknown>,
  ): PipelineStage[] {
    return [
      { $match: baseFilter },
      ...this.userLookupStages(),
      {
        $sort: {
          lastDonationDate: 1,
          createdAt: -1,
        },
      },
      ...this.safeDonorProjectionStages(),
    ];
  }

  private buildPublicProfilePipeline(id: string): PipelineStage[] {
    return [
      {
        $match: {
          _id: new Types.ObjectId(id),
          isActive: true,
        },
      },
      ...this.userLookupStages(),
      ...this.safeDonorProjectionStages(),
    ];
  }

  private userLookupStages(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $match: { 'user.isBlocked': { $ne: true } } },
    ];
  }

  private safeDonorProjectionStages(): PipelineStage[] {
    return [
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          userId: { $toString: '$userId' },
          name: '$user.name',
          profileImage: '$user.profileImage',
          bloodGroup: 1,
          state: 1,
          city: 1,
          district: 1,
          distanceKm: 1,
          isAvailable: 1,
          isVerified: 1,
          lastDonationDate: 1,
          nextEligibleDate: 1,
          totalDonations: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
  }
}
