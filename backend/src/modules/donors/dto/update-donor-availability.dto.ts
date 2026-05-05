import { IsBoolean } from 'class-validator';

export class UpdateDonorAvailabilityDto {
  @IsBoolean()
  isAvailable: boolean;
}
