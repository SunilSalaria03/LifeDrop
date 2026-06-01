import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema.types';
import {
  CAMPAIGN_DEFAULT_LIMIT,
  CAMPAIGN_DEFAULT_PAGE,
  CAMPAIGN_MAX_LIMIT,
} from './campaigns.constants';
import { CampaignListResult } from './campaigns.types';
import { CampaignQueryDto } from './dto/campaign-query.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { MyCampaignQueryDto } from './dto/my-campaign-query.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign, CampaignStatus } from './schemas/campaign.schema';
import { CampaignDocument } from './schemas/campaign.schema.types';

type CampaignSortBy = 'startDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'title';
type CampaignSortOrder = 'asc' | 'desc';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,
  ) {}

  async listPublicCampaigns(
    query: CampaignQueryDto,
  ): Promise<CampaignListResult<Campaign>> {
    const page = this.normalizePage(query.page);
    const limit = this.normalizeLimit(query.limit);
    const skip = (page - 1) * limit;
    const filter = this.buildPublicCampaignFilter(query);

    const [count, items] = await Promise.all([
      this.campaignModel.countDocuments(filter).exec(),
      this.campaignModel
        .find(filter)
        .sort(this.buildSort(query.sortBy, query.sortOrder))
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      items,
      count,
      page,
      limit,
      totalPages: count === 0 ? 0 : Math.ceil(count / limit),
    };
  }

  async getPublicCampaignBySlug(slug: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOne({
        slug,
        isPublic: true,
      })
      .exec();

    if (!campaign) {
      throw new NotFoundException('Campaign not found.');
    }

    return campaign;
  }

  async createCampaign(
    user: UserDocument,
    dto: CreateCampaignDto,
  ): Promise<Campaign> {
    this.assertDateConsistency(dto);

    const slug = await this.generateUniqueSlug(dto.title);
    const createPayload = this.sanitizeCampaignWriteFields(dto);
    const campaign = await this.campaignModel.create({
      ...createPayload,
      slug,
      startDate: new Date(createPayload.startDate as string),
      endDate: new Date(createPayload.endDate as string),
      registrationDeadline: createPayload.registrationDeadline
        ? new Date(createPayload.registrationDeadline as string)
        : undefined,
      createdBy: {
        userId: user._id,
        name: user.name,
        role: user.role,
      },
      status: CampaignStatus.Draft,
    });

    return campaign;
  }

  async updateOwnCampaign(
    user: UserDocument,
    id: string,
    dto: UpdateCampaignDto,
  ): Promise<Campaign> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid campaign id.');
    }

    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException('Campaign not found.');
    }

    if (campaign.createdBy.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only update your own campaigns.');
    }

    const updatePayload = this.sanitizeCampaignWriteFields(dto);
    this.assertDateConsistency({
      startDate: (updatePayload.startDate as string | undefined) ?? campaign.startDate?.toISOString(),
      endDate: (updatePayload.endDate as string | undefined) ?? campaign.endDate?.toISOString(),
      registrationDeadline:
        updatePayload.registrationDeadline === undefined
          ? campaign.registrationDeadline?.toISOString()
          : (updatePayload.registrationDeadline as string),
    });

    const updateData: Record<string, unknown> = { ...updatePayload };
    if (dto.title && dto.title !== campaign.title) {
      updateData.slug = await this.generateUniqueSlug(dto.title, campaign._id);
    }
    if (updatePayload.startDate) {
      updateData.startDate = new Date(updatePayload.startDate as string);
    }
    if (updatePayload.endDate) {
      updateData.endDate = new Date(updatePayload.endDate as string);
    }
    if (updatePayload.registrationDeadline !== undefined) {
      updateData.registrationDeadline = updatePayload.registrationDeadline
        ? new Date(updatePayload.registrationDeadline as string)
        : null;
    }

    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(campaign._id, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCampaign) {
      throw new NotFoundException('Campaign not found.');
    }

    return updatedCampaign;
  }

  async listMyCampaigns(
    user: UserDocument,
    query: MyCampaignQueryDto,
  ): Promise<CampaignListResult<Campaign>> {
    const page = this.normalizePage(query.page);
    const limit = this.normalizeLimit(query.limit);
    const skip = (page - 1) * limit;
    const filter: FilterQuery<CampaignDocument> = {
      'createdBy.userId': user._id,
    };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search?.trim()) {
      const searchRegex = new RegExp(this.escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
      ];
    }

    const [count, items] = await Promise.all([
      this.campaignModel.countDocuments(filter).exec(),
      this.campaignModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      items,
      count,
      page,
      limit,
      totalPages: count === 0 ? 0 : Math.ceil(count / limit),
    };
  }

  async getOwnCampaignById(user: UserDocument, id: string): Promise<Campaign> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid campaign id.');
    }

    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException('Campaign not found.');
    }

    if (campaign.createdBy.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only view your own campaigns.');
    }

    return campaign;
  }

  async deleteOwnCampaign(
    user: UserDocument,
    id: string,
  ): Promise<{ id: string; deleted: true }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid campaign id.');
    }

    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException('Campaign not found.');
    }

    if (campaign.createdBy.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only delete your own campaigns.');
    }

    await this.campaignModel.deleteOne({ _id: campaign._id }).exec();

    return { id, deleted: true };
  }

  private assertDateConsistency(
    dto: {
      startDate?: string;
      endDate?: string;
      registrationDeadline?: string;
    },
  ) {
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    const registrationDeadline = dto.registrationDeadline
      ? new Date(dto.registrationDeadline)
      : undefined;

    if (startDate && Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('startDate must be a valid date.');
    }
    if (endDate && Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('endDate must be a valid date.');
    }
    if (registrationDeadline && Number.isNaN(registrationDeadline.getTime())) {
      throw new BadRequestException('registrationDeadline must be a valid date.');
    }

    if (startDate && endDate && endDate < startDate) {
      throw new BadRequestException('endDate cannot be before startDate.');
    }

    if (registrationDeadline && startDate && registrationDeadline > startDate) {
      throw new BadRequestException(
        'registrationDeadline cannot be after startDate.',
      );
    }
  }

  private async generateUniqueSlug(
    title: string,
    excludeId?: Types.ObjectId,
  ): Promise<string> {
    const baseSlug = this.slugify(title);
    let slug = baseSlug;
    let suffix = 1;

    while (
      await this.campaignModel.exists({
        slug,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      })
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private slugify(value: string): string {
    const normalized = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (!normalized) {
      throw new BadRequestException('Unable to generate slug from title.');
    }

    return normalized;
  }

  private buildPublicCampaignFilter(
    query: CampaignQueryDto,
  ): FilterQuery<CampaignDocument> {
    const filter: FilterQuery<CampaignDocument> = {
      isPublic: true,
    };

    if (query.status) {
      filter.status = query.status;
    }
    if (query.type) {
      filter.type = query.type;
    }
    if (query.state) {
      filter['location.state'] = query.state;
    }
    if (query.city) {
      filter['location.city'] = query.city;
    }
    if (query.district) {
      filter['location.district'] = query.district;
    }
    if (query.pincode) {
      filter['location.pincode'] = query.pincode;
    }

    if (query.month) {
      const [yearText, monthText] = query.month.split('-');
      const year = Number(yearText);
      const month = Number(monthText);
      if (!year || !month || month < 1 || month > 12) {
        throw new BadRequestException('month must be in YYYY-MM format.');
      }

      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      filter.startDate = { $gte: start, $lt: end };
    }

    if (query.search?.trim()) {
      const searchRegex = new RegExp(this.escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex },
        { 'location.district': searchRegex },
        { 'location.venue': searchRegex },
      ];
    }

    return filter;
  }

  private buildSort(
    sortBy: CampaignSortBy | undefined,
    sortOrder: CampaignSortOrder | undefined,
  ): Record<string, SortOrder> {
    const field = sortBy ?? 'startDate';
    const direction: SortOrder = sortOrder === 'asc' ? 1 : -1;
    return { [field]: direction };
  }

  private normalizePage(page?: number): number {
    const resolved = page ?? CAMPAIGN_DEFAULT_PAGE;
    if (!Number.isFinite(resolved) || resolved < 1) {
      throw new BadRequestException('page must be at least 1.');
    }
    return Math.floor(resolved);
  }

  private normalizeLimit(limit?: number): number {
    const resolved = limit ?? CAMPAIGN_DEFAULT_LIMIT;
    if (!Number.isFinite(resolved) || resolved < 1) {
      throw new BadRequestException('limit must be at least 1.');
    }
    if (resolved > CAMPAIGN_MAX_LIMIT) {
      throw new BadRequestException(
        `limit must be less than or equal to ${CAMPAIGN_MAX_LIMIT}.`,
      );
    }
    return Math.floor(resolved);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private sanitizeCampaignWriteFields(
    dto: Partial<CreateCampaignDto>,
  ): Partial<CreateCampaignDto> {
    const sanitized: Partial<CreateCampaignDto> = {};

    for (const field of [
      'title',
      'shortDescription',
      'description',
      'type',
      'organizer',
      'location',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'timezone',
      'bloodGroupsNeeded',
      'donationTypes',
      'capacity',
      'allowWalkIn',
      'registrationRequired',
      'registrationDeadline',
      'contactPerson',
      'eligibilityNotes',
      'scheduleNotes',
      'instructions',
      'highlights',
      'images',
      'documents',
      'isFree',
      'seo',
    ] as const) {
      if (dto[field] !== undefined) {
        (sanitized as Record<string, unknown>)[field] = dto[field];
      }
    }

    return sanitized;
  }
}
