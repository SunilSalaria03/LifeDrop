import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationQueryDto } from './dto/location-query.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('states')
  getStates() {
    return this.locationsService.getStates();
  }

  @Get('districts')
  @ApiQuery({
    name: 'state',
    required: true,
    type: String,
    example: 'Punjab',
  })
  getDistricts(@Query() locationQueryDto: LocationQueryDto) {
    return this.locationsService.getDistricts(locationQueryDto);
  }

  @Get('cities')
  @ApiQuery({
    name: 'state',
    required: true,
    type: String,
    example: 'Punjab',
  })
  @ApiQuery({
    name: 'district',
    required: false,
    type: String,
    example: 'Chandigarh',
  })
  getCities(@Query() locationQueryDto: LocationQueryDto) {
    return this.locationsService.getCities(locationQueryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @Post('bulk')
  bulkCreate(
    @Body(new ParseArrayPipe({ items: CreateLocationDto }))
    createLocationDtos: CreateLocationDto[],
  ) {
    return this.locationsService.bulkCreate(createLocationDtos);
  }

  @Get('search')
  @ApiQuery({
    name: 'keyword',
    required: true,
    type: String,
    example: 'Chandigarh',
  })
  search(@Query() locationQueryDto: LocationQueryDto) {
    return this.locationsService.search(locationQueryDto);
  }

  @Get('reverse-geocode')
  @ApiQuery({
    name: 'lat',
    required: true,
    type: Number,
    example: 30.7333,
  })
  @ApiQuery({
    name: 'lng',
    required: true,
    type: Number,
    example: 76.7794,
  })
  reverseGeocode(@Query() reverseGeocodeDto: ReverseGeocodeDto) {
    return this.locationsService.reverseGeocode(reverseGeocodeDto);
  }
}
