import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CampaignStatus, CampaignType } from '../schemas/campaign.schema';

export class CampaignQueryDto {
  @ApiPropertyOptional({ enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiPropertyOptional({ enum: CampaignType })
  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;

  @ApiPropertyOptional({ example: 'Punjab' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Chandigarh' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Chandigarh' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: '160030' })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({ example: '2026-06' })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ example: 'mohali' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'startDate' })
  @IsOptional()
  @IsIn(['startDate', 'endDate', 'createdAt', 'updatedAt', 'title'])
  sortBy?: 'startDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'title';

  @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
