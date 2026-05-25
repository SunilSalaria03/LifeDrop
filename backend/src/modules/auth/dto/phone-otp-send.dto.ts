import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsIndianMobilePhone } from '../../../common/decorators/is-indian-mobile-phone.decorator';

export class PhoneOtpSendDto {
  @ApiProperty({ example: '+919999999999' })
  @IsNotEmpty()
  @IsIndianMobilePhone()
  phone: string;
}
