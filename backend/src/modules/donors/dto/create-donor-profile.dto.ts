import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { BloodGroup } from '../schemas/donor-profile.schema';
import { Gender } from '../../users/schemas/user.schema';

export class CreateDonorProfileDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'rahul@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+919999999999' })
  @IsPhoneNumber('IN')
  phone: string;

  @ApiProperty({ enum: BloodGroup, example: BloodGroup.OPositive })
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @ApiPropertyOptional({ enum: Gender, example: Gender.Male })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ example: '1996-08-15' })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ example: 72 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight: number;

  @ApiPropertyOptional({ example: '+918888888888' })
  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @ApiProperty({ example: 'Tamil Nadu' })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: 'Chennai' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Chennai' })
  @IsString()
  @MaxLength(100)
  district: string;

  @ApiPropertyOptional({ example: 'Roorkee' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tehsil?: string;

  @ApiPropertyOptional({ example: 'Anna Nagar, Chennai' })
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
  @Type(() => Boolean)
  @IsBoolean()
  showMobile: boolean;

  @ApiPropertyOptional({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  smsAlert: boolean;

  @ApiPropertyOptional({ example: '160017' })
  @IsOptional()
  @IsPostalCode('IN')
  pincode?: string;

  @ApiProperty({ example: 13.0827 })
  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 80.2707 })
  @Type(() => Number)
  @IsLongitude()
  lng: number;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  lastDonationDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
