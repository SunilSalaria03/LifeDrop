import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

type AuthenticatedRequest = Request & {
  user: UserDocument;
};

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Get('profile')
  getProfile(@Req() request: AuthenticatedRequest) {
    return this.usersService.toSafeUser(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Put('profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(request.user, updateUserProfileDto);
  }
}
