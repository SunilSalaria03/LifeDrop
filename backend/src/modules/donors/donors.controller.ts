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
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateDonorProfileDto } from './dto/create-donor-profile.dto';
import { DonorSearchQueryDto } from './dto/donor-search-query.dto';
import { UpdateDonorAvailabilityDto } from './dto/update-donor-availability.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';
import { DonorsService } from './donors.service';
import { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
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
  @ApiCookieAuth('access_token')
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
  @ApiCookieAuth('access_token')
  @Get('profile/me')
  getMyProfile(@Req() request: AuthenticatedRequest) {
    return this.donorsService.getMyProfile(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
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
  @ApiQuery({
    name: 'bloodGroup',
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    example: 'O+',
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    type: Number,
    example: 30.7333,
  })
  @ApiQuery({
    name: 'lng',
    required: false,
    type: Number,
    example: 76.7794,
  })
  @ApiQuery({
    name: 'radiusKm',
    required: false,
    type: Number,
    example: 50,
    description: 'Defaults to 50. Maximum 50.',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    type: String,
    example: 'Punjab',
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
    example: 'Chandigarh',
  })
  @ApiQuery({
    name: 'district',
    required: false,
    type: String,
    example: 'Chandigarh',
  })
  search(@Query() donorSearchQueryDto: DonorSearchQueryDto) {
    return this.donorsService.search(donorSearchQueryDto);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.donorsService.getPublicProfile(id);
  }
}
