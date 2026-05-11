import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { BloodRequestsModule } from './modules/blood-requests/blood-requests.module';
import { DonorsModule } from './modules/donors/donors.module';
import { LocationsModule } from './modules/locations/locations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UsersModule } from './modules/users/users.module';
import { getMongoUri } from './app.helpers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: getMongoUri(configService),
      }),
    }),
    UsersModule,
    AuthModule,
    DonorsModule,
    LocationsModule,
    BloodRequestsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
