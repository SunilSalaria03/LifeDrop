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
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsPhoneNumber('IN')
  phone: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @IsString()
  @MaxLength(100)
  state: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressText?: string;

  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @Type(() => Number)
  @IsLongitude()
  lng: number;

  @IsOptional()
  @IsDateString()
  lastDonationDate?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
