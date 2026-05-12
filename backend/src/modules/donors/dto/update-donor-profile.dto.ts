import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CreateDonorProfileDto } from './create-donor-profile.dto';
import { BloodGroup } from '../schemas/donor-profile.schema';
import { Gender } from '../../users/schemas/user.schema';

export class UpdateDonorProfileDto implements Partial<CreateDonorProfileDto> {
  @ApiPropertyOptional({ example: 'Rahul Sharma' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'rahul@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+919999999999' })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiPropertyOptional({ enum: BloodGroup, example: BloodGroup.APositive })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({ enum: Gender, example: Gender.Male })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: '1996-08-15' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 72 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight?: number;

  @ApiPropertyOptional({ example: '+918888888888' })
  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @ApiPropertyOptional({ example: 'Tamil Nadu' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({ example: 'Roorkee' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tehsil?: string;

  @ApiPropertyOptional({ example: 'T Nagar, Chennai' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressText?: string;

  @ApiPropertyOptional({ example: 'House 21, Anna Nagar Main Road' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressLine?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  showMobile?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  smsAlert?: boolean;

  @ApiPropertyOptional({ example: '160017' })
  @IsOptional()
  @IsPostalCode('IN')
  pincode?: string;

  @ApiPropertyOptional({ example: 13.0827 })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  lat?: number;

  @ApiPropertyOptional({ example: 80.2707 })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  lng?: number;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  lastDonationDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
