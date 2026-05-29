import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { User, UserRole } from '../../users/schemas/user.schema';

export enum CampaignType {
  BloodDonation = 'blood_donation',
  Awareness = 'awareness',
  HealthCheckup = 'health_checkup',
}

export enum CampaignStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum OrganizerType {
  Individual = 'individual',
  Hospital = 'hospital',
  Ngo = 'ngo',
  College = 'college',
  Company = 'company',
}

export enum DonationType {
  WholeBlood = 'whole_blood',
  Plasma = 'plasma',
  Platelets = 'platelets',
}

export enum CampaignApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

const CoordinatesSchema = new MongooseSchema(
  {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  { _id: false },
);

const CreatedBySchema = new MongooseSchema(
  {
    userId: {
      type: Types.ObjectId,
      ref: User.name,
      required: true,
    },
    name: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false },
);

const OrganizerSchema = new MongooseSchema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(OrganizerType),
      default: OrganizerType.Individual,
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
  },
  { _id: false },
);

const LocationSchema = new MongooseSchema(
  {
    venue: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    coordinates: { type: CoordinatesSchema, default: {} },
  },
  { _id: false },
);

const ContactPersonSchema = new MongooseSchema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false },
);

const CampaignImagesSchema = new MongooseSchema(
  {
    bannerUrl: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
  },
  { _id: false },
);

const CampaignApprovalSchema = new MongooseSchema(
  {
    status: {
      type: String,
      enum: Object.values(CampaignApprovalStatus),
      default: CampaignApprovalStatus.Pending,
    },
    reviewedBy: { type: String, trim: true },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
  },
  { _id: false },
);

const CampaignStatsSchema = new MongooseSchema(
  {
    views: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 },
    interestedCount: { type: Number, default: 0, min: 0 },
    completedDonations: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const CampaignSeoSchema = new MongooseSchema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { _id: false },
);

@Schema({
  timestamps: true,
  collection: 'campaigns',
  toJSON: {
    transform: (_doc, ret) => {
      const safeRet = ret as Record<string, unknown>;
      safeRet.id = safeRet._id?.toString();
      delete safeRet._id;
      delete safeRet.__v;
      return safeRet;
    },
  },
})
export class Campaign {
  @Prop({ required: true, trim: true })
  slug: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, maxlength: 300 })
  shortDescription: string;

  @Prop({ required: true, trim: true, maxlength: 5000 })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(CampaignType),
    default: CampaignType.BloodDonation,
  })
  type: CampaignType;

  @Prop({
    type: String,
    enum: Object.values(CampaignStatus),
    default: CampaignStatus.Draft,
  })
  status: CampaignStatus;

  @Prop({ type: CreatedBySchema, required: true })
  createdBy: {
    userId: Types.ObjectId;
    name?: string;
    role?: UserRole;
    phone?: string;
    email?: string;
  };

  @Prop({ type: OrganizerSchema, required: true })
  organizer: {
    name: string;
    type: OrganizerType;
    phone?: string;
    email?: string;
    website?: string;
  };

  @Prop({ type: LocationSchema, required: true })
  location: {
    venue: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates?: {
      lat?: number | null;
      lng?: number | null;
    };
  };

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ trim: true })
  startTime?: string;

  @Prop({ trim: true })
  endTime?: string;

  @Prop({ trim: true, default: 'Asia/Kolkata' })
  timezone: string;

  @Prop({ type: [String], default: [] })
  bloodGroupsNeeded: string[];

  @Prop({
    type: [String],
    enum: Object.values(DonationType),
    default: [DonationType.WholeBlood],
  })
  donationTypes: DonationType[];

  @Prop({ min: 0, default: 0 })
  capacity: number;

  @Prop({ min: 0, default: 0 })
  registrationCount: number;

  @Prop({ default: true })
  allowWalkIn: boolean;

  @Prop({ default: true })
  registrationRequired: boolean;

  @Prop()
  registrationDeadline?: Date;

  @Prop({ type: ContactPersonSchema, default: {} })
  contactPerson: {
    name?: string;
    phone?: string;
    email?: string;
  };

  @Prop({ trim: true })
  eligibilityNotes?: string;

  @Prop({ trim: true })
  scheduleNotes?: string;

  @Prop({ trim: true })
  instructions?: string;

  @Prop({ type: [String], default: [] })
  highlights: string[];

  @Prop({ type: CampaignImagesSchema, default: {} })
  images: {
    bannerUrl?: string;
    thumbnailUrl?: string;
  };

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({ default: true })
  isFree: boolean;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: CampaignApprovalSchema, default: {} })
  approval: {
    status: CampaignApprovalStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    rejectionReason?: string;
  };

  @Prop({ type: CampaignStatsSchema, default: {} })
  stats: {
    views: number;
    shares: number;
    interestedCount: number;
    completedDonations: number;
  };

  @Prop({ type: CampaignSeoSchema, default: {} })
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.index({ slug: 1 }, { unique: true });
CampaignSchema.index({ status: 1, startDate: 1 });
CampaignSchema.index({ type: 1 });
CampaignSchema.index({ isPublic: 1 });
CampaignSchema.index({ isFeatured: 1 });
CampaignSchema.index({ isVerified: 1 });
CampaignSchema.index({ endDate: 1 });
CampaignSchema.index({ 'location.state': 1 });
CampaignSchema.index({ 'location.city': 1 });
CampaignSchema.index({ 'location.district': 1 });
CampaignSchema.index({ 'location.pincode': 1 });
CampaignSchema.index({ 'createdBy.userId': 1, createdAt: -1 });
