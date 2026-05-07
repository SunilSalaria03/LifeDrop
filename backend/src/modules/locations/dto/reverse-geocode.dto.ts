import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class ReverseGeocodeDto {
  @ApiProperty({ example: 13.0827 })
  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 80.2707 })
  @Type(() => Number)
  @IsLongitude()
  lng: number;
}
