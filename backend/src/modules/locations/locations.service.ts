import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationQueryDto } from './dto/location-query.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { Location } from './schemas/location.schema';
import { LocationDocument } from './schemas/location.schema.types';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async getStates() {
    const states = await this.locationModel
      .distinct('state', { isActive: true })
      .exec();

    return states.sort((a, b) => a.localeCompare(b));
  }

  async getDistricts(query: LocationQueryDto) {
    if (!query.state) {
      throw new BadRequestException('state is required.');
    }

    const districts = await this.locationModel
      .distinct('district', { state: query.state, isActive: true })
      .exec();

    return districts.sort((a, b) => a.localeCompare(b));
  }

  async getCities(query: LocationQueryDto) {
    if (!query.state) {
      throw new BadRequestException('state is required.');
    }

    const filter: FilterQuery<LocationDocument> = {
      state: query.state,
      isActive: true,
    };

    if (query.district) {
      filter.district = query.district;
    }

    const cities = await this.locationModel.distinct('city', filter).exec();

    return cities.sort((a, b) => a.localeCompare(b));
  }

  create(dto: CreateLocationDto) {
    this.assertValidCoordinates(dto);
    return this.locationModel.create(this.toLocationData(dto));
  }

  async bulkCreate(dtos: CreateLocationDto[]) {
    if (!dtos.length) {
      throw new BadRequestException('At least one location is required.');
    }

    dtos.forEach((dto) => this.assertValidCoordinates(dto));
    const operations = dtos.map((dto) => {
      const data = this.toLocationData(dto);

      return {
        updateOne: {
          filter: {
            country: data.country,
            state: data.state,
            district: data.district,
            city: data.city,
            pincode: data.pincode ?? null,
          },
          update: { $set: data },
          upsert: true,
        },
      };
    });
    const result = await this.locationModel.bulkWrite(operations, {
      ordered: false,
    });

    return {
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      matched: result.matchedCount,
    };
  }

  search(query: LocationQueryDto) {
    if (!query.keyword) {
      throw new BadRequestException('keyword is required.');
    }

    const keyword = new RegExp(this.escapeRegex(query.keyword), 'i');

    return this.locationModel
      .find({
        isActive: true,
        $or: [
          { state: keyword },
          { district: keyword },
          { city: keyword },
          { pincode: keyword },
        ],
      })
      .limit(25)
      .sort({ state: 1, district: 1, city: 1 })
      .exec();
  }

  reverseGeocode(_query: ReverseGeocodeDto) {
    throw new BadRequestException(
      'Reverse geocoding provider is not configured.',
    );
  }

  private toLocationData(dto: CreateLocationDto) {
    return {
      country: dto.country ?? 'India',
      state: dto.state,
      district: dto.district,
      city: dto.city,
      pincode: dto.pincode,
      isActive: dto.isActive ?? true,
      location:
        dto.lat !== undefined && dto.lng !== undefined
          ? {
              type: 'Point' as const,
              coordinates: [Number(dto.lng), Number(dto.lat)] as [
                number,
                number,
              ],
            }
          : undefined,
    };
  }

  private assertValidCoordinates(dto: CreateLocationDto): void {
    if ((dto.lat === undefined) !== (dto.lng === undefined)) {
      throw new BadRequestException(
        'Both lat and lng are required when location coordinates are supplied.',
      );
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
