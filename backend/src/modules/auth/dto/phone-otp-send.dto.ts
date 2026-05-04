import { IsNotEmpty, Matches } from 'class-validator';

export class PhoneOtpSendDto {
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'phone must be in E.164 format, for example +919999999999.'
  })
  phone: string;
}

