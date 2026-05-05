import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LocationQueryDto {
  @ApiPropertyOptional({ example: 'Tamil Nadu' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'chen' })
  @IsOptional()
  @IsString()
  keyword?: string;
}
