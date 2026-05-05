import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloodRequest,
  BloodRequestSchema,
} from './schemas/blood-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloodRequest.name, schema: BloodRequestSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class BloodRequestsModule {}
