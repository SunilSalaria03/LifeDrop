import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsIndianMobilePhone } from '../../../common/decorators/is-indian-mobile-phone.decorator';
import {
  CampaignStatus,
  CampaignType,
  DonationType,
  OrganizerType,
} from '../schemas/campaign.schema';

class OrganizerDto {
  @ApiProperty({ example: 'LifeDrop Foundation' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ enum: OrganizerType, example: OrganizerType.Ngo })
  @IsOptional()
  @IsEnum(OrganizerType)
  type?: OrganizerType;

  @ApiPropertyOptional({ example: '+919999999999' })
  @IsOptional()
  @IsIndianMobilePhone()
  phone?: string;

  @ApiPropertyOptional({ example: 'help@lifedrop.org' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://lifedrop.org' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  website?: string;
}

class CoordinatesDto {
  @ApiPropertyOptional({ example: 30.7333 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number | null;

  @ApiPropertyOptional({ example: 76.7794 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number | null;
}

class LocationDto {
  @ApiProperty({ example: 'GMCH Blood Bank Block' })
  @IsString()
  @MaxLength(150)
  venue: string;

  @ApiProperty({ example: 'Sector 32, Madhya Marg' })
  @IsString()
  @MaxLength(250)
  address: string;

  @ApiProperty({ example: 'Chandigarh' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Chandigarh' })
  @IsString()
  @MaxLength(100)
  district: string;

  @ApiProperty({ example: 'Chandigarh' })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: '160030' })
  @IsPostalCode('IN')
  pincode: string;

  @ApiPropertyOptional({ example: 'Near trauma block gate' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  landmark?: string;

  @ApiPropertyOptional({ type: CoordinatesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

class ContactPersonDto {
  @ApiPropertyOptional({ example: 'Rahul Sharma' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: '+919999999999' })
  @IsOptional()
  @IsIndianMobilePhone()
  phone?: string;

  @ApiPropertyOptional({ example: 'rahul@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

class ImagesDto {
  @ApiPropertyOptional({ example: 'https://cdn.lifedrop.org/campaigns/banner.png' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  bannerUrl?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.lifedrop.org/campaigns/thumb.png',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  thumbnailUrl?: string;
}

class SeoDto {
  @ApiPropertyOptional({ example: 'LifeDrop Mega Blood Drive Chandigarh' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Join this blood donation drive in Chandigarh.' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'LifeDrop Mega Blood Drive — Chandigarh' })
  @IsString()
  @MaxLength(160)
  title: string;

  @ApiProperty({
    example: 'Weekend donation camp with on-site screening and refreshments.',
  })
  @IsString()
  @MaxLength(300)
  shortDescription: string;

  @ApiProperty({
    example:
      'Join LifeDrop and partner hospitals for a large-scale blood donation drive.',
  })
  @IsString()
  @MaxLength(5000)
  description: string;

  @ApiPropertyOptional({
    enum: CampaignType,
    example: CampaignType.BloodDonation,
  })
  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;

  @ApiPropertyOptional({ enum: CampaignStatus, example: CampaignStatus.Draft })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiProperty({ type: OrganizerDto })
  @ValidateNested()
  @Type(() => OrganizerDto)
  organizer: OrganizerDto;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ example: '2026-06-02T08:30:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-06-02T16:30:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: '08:30' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  startTime?: string;

  @ApiPropertyOptional({ example: '16:30' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  endTime?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;

  @ApiPropertyOptional({ example: ['A+', 'B+', 'O+'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  bloodGroupsNeeded?: string[];

  @ApiPropertyOptional({
    enum: DonationType,
    isArray: true,
    example: [DonationType.WholeBlood],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsEnum(DonationType, { each: true })
  donationTypes?: DonationType[];

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  registrationCount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  allowWalkIn?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  registrationRequired?: boolean;

  @ApiPropertyOptional({ example: '2026-05-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  registrationDeadline?: string;

  @ApiPropertyOptional({ type: ContactPersonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  contactPerson?: ContactPersonDto;

  @ApiPropertyOptional({ example: 'Donors must be 18–65 and above 50kg.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  eligibilityNotes?: string;

  @ApiPropertyOptional({ example: 'Open daily 9:00 AM to 5:00 PM.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  scheduleNotes?: string;

  @ApiPropertyOptional({ example: 'Bring a valid government-issued photo ID.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  instructions?: string;

  @ApiPropertyOptional({ example: ['Free hemoglobin check', 'Certificate'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ type: ImagesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImagesDto)
  images?: ImagesDto;

  @ApiPropertyOptional({ example: ['https://cdn.site/permission-letter.pdf'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  documents?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ type: SeoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;
}
