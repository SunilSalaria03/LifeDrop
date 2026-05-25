import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { IsIndianMobilePhone } from '../../../common/decorators/is-indian-mobile-phone.decorator';

export class PhoneOtpVerifyDto {
  @ApiProperty({ example: '+919999999999' })
  @IsNotEmpty()
  @IsIndianMobilePhone()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @Matches(/^\d{4,8}$/, {
    message: 'otp must be 4 to 8 digits.'
  })
  otp: string;
}
