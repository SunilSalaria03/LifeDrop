import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BloodGroup } from '../../donors/schemas/donor-profile.schema';

export class SendSmsAlertDto {
  @ApiProperty({ example: '663b8d2f9b9b1f0012a4f001' })
  @IsMongoId()
  donorId: string;

  @ApiProperty({ enum: BloodGroup, example: BloodGroup.OPositive })
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @ApiProperty({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  @Equals(true, {
    message: 'sendSms must be true.',
  })
  sendSms: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  sendWhatsapp?: boolean = false;

  @ApiProperty({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  @Equals(true, {
    message: 'consentToShareContact must be true.',
  })
  consentToShareContact: true;

  @ApiPropertyOptional({
    example: 'Urgent O+ blood request. Please respond if available.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @ApiPropertyOptional({ example: 'Rahul Verma' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  requesterName?: string;

  @ApiPropertyOptional({ example: 'Indore, Madhya Pradesh' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  requesterLocation?: string;
}
