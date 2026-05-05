import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateDonorProfileDto } from './dto/create-donor-profile.dto';
import { DonorSearchQueryDto } from './dto/donor-search-query.dto';
import { UpdateDonorAvailabilityDto } from './dto/update-donor-availability.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';
import { DonorsService } from './donors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';

type AuthenticatedRequest = Request & {
  user: UserDocument;
};

@ApiTags('donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('profile')
  createProfile(
    @Req() request: AuthenticatedRequest,
    @Body() createDonorProfileDto: CreateDonorProfileDto,
  ) {
    return this.donorsService.createProfile(
      request.user,
      createDonorProfileDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateDonorProfileDto: UpdateDonorProfileDto,
  ) {
    return this.donorsService.updateProfile(
      request.user,
      updateDonorProfileDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile/me')
  getMyProfile(@Req() request: AuthenticatedRequest) {
    return this.donorsService.getMyProfile(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile/availability')
  updateAvailability(
    @Req() request: AuthenticatedRequest,
    @Body() updateDonorAvailabilityDto: UpdateDonorAvailabilityDto,
  ) {
    return this.donorsService.updateAvailability(
      request.user,
      updateDonorAvailabilityDto,
    );
  }

  @Get('search')
  search(@Query() donorSearchQueryDto: DonorSearchQueryDto) {
    return this.donorsService.search(donorSearchQueryDto);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.donorsService.getPublicProfile(id);
  }
}
