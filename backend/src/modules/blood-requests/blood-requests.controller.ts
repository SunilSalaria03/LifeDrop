import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BloodRequestService } from './blood-request.service';
import { SendSmsAlertDto } from './dto/send-sms-alert.dto';

@ApiTags('blood-requests')
@Controller('blood-requests')
export class BloodRequestsController {
  constructor(private readonly bloodRequestService: BloodRequestService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Post('send-sms-alert')
  sendSmsAlert(
    @Req() request: AuthenticatedRequest,
    @Body() sendSmsAlertDto: SendSmsAlertDto,
  ) {
    return this.bloodRequestService.sendSmsAlert(
      request.user,
      sendSmsAlertDto,
    );
  }
}
