import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationQueryDto } from './dto/location-query.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('states')
  getStates() {
    return this.locationsService.getStates();
  }

  @Get('districts')
  getDistricts(@Query() locationQueryDto: LocationQueryDto) {
    return this.locationsService.getDistricts(locationQueryDto);
  }

  @Get('cities')
  getCities(@Query() locationQueryDto: LocationQueryDto) {
    return this.locationsService.getCities(locationQueryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post('bulk')
  bulkCreate(
    @Body(new ParseArrayPipe({ items: CreateLocationDto }))
    createLocationDtos: CreateLocationDto[],
  ) {
    return this.locationsService.bulkCreate(createLocationDtos);
  }

  @Get('search')
  search(@Query() locationQueryDto: LocationQueryDto) {
    return this.locationsService.search(locationQueryDto);
  }

  @Get('reverse-geocode')
  reverseGeocode(@Query() reverseGeocodeDto: ReverseGeocodeDto) {
    return this.locationsService.reverseGeocode(reverseGeocodeDto);
  }
}
