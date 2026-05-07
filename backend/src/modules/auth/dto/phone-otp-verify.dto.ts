import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class PhoneOtpVerifyDto {
  @ApiProperty({ example: '+919999999999' })
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'phone must be in E.164 format, for example +919999999999.'
  })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @Matches(/^\d{4,8}$/, {
    message: 'otp must be 4 to 8 digits.'
  })
  otp: string;
}
