import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { BloodGroup } from '../schemas/donor-profile.schema';

export class CreateDonorProfileDto {
  @ApiProperty({ enum: BloodGroup, example: BloodGroup.OPositive })
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @ApiProperty({ example: '+919999999999' })
  @IsPhoneNumber('IN')
  phone: string;

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

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({ example: 'Anna Nagar, Chennai' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressText?: string;

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
