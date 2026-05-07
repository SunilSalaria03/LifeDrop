import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DonorProfile,
  DonorProfileSchema,
} from '../donors/schemas/donor-profile.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { BloodRequestService } from './blood-request.service';
import { BloodRequestsController } from './blood-requests.controller';
import {
  BloodRequest,
  BloodRequestSchema,
} from './schemas/blood-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloodRequest.name, schema: BloodRequestSchema },
      { name: DonorProfile.name, schema: DonorProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BloodRequestsController],
  providers: [BloodRequestService],
  exports: [MongooseModule],
})
export class BloodRequestsModule {}
