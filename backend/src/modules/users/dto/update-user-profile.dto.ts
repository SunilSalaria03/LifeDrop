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
import { Gender } from '../schemas/user.schema';

export class UpdateUserProfileDto {
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

  @ApiPropertyOptional({
    example: 'https://example.com/images/profile.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  profileImage?: string;

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

  @ApiPropertyOptional({ example: 'O+' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  bloodGroup?: string;

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

  @ApiPropertyOptional({ example: '2025-02-01' })
  @IsOptional()
  @IsDateString()
  lastDonationDate?: string;

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
}
