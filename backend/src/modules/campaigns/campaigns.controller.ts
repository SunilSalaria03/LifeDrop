import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignsService } from './campaigns.service';
import { CampaignQueryDto } from './dto/campaign-query.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { MyCampaignQueryDto } from './dto/my-campaign-query.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  listPublicCampaigns(@Query() campaignQueryDto: CampaignQueryDto) {
    return this.campaignsService.listPublicCampaigns(campaignQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Post()
  createCampaign(
    @Req() request: AuthenticatedRequest,
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignsService.createCampaign(request.user, createCampaignDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Put(':id')
  updateOwnCampaign(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.updateOwnCampaign(
      request.user,
      id,
      updateCampaignDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Get('me')
  listMyCampaigns(
    @Req() request: AuthenticatedRequest,
    @Query() myCampaignQueryDto: MyCampaignQueryDto,
  ) {
    return this.campaignsService.listMyCampaigns(request.user, myCampaignQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Get('me/:id')
  getOwnCampaignById(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.campaignsService.getOwnCampaignById(request.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @Delete(':id')
  deleteOwnCampaign(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.campaignsService.deleteOwnCampaign(request.user, id);
  }

  @Get(':slug')
  getPublicCampaignBySlug(@Param('slug') slug: string) {
    return this.campaignsService.getPublicCampaignBySlug(slug);
  }
}
