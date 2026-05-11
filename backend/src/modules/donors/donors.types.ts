import { CreateDonorProfileDto } from './dto/create-donor-profile.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';

export type DonorProfileInput = CreateDonorProfileDto | UpdateDonorProfileDto;
