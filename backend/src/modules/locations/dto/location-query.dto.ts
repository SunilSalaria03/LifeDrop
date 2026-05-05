import { IsOptional, IsString } from 'class-validator';

export class LocationQueryDto {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  keyword?: string;
}
