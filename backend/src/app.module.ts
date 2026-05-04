import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

function getMongoUri(configService: ConfigService): string {
  const mongoUri = configService.get<string>('MONGODB_URI');

  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI. Create backend/.env from backend/.env.example and set MONGODB_URI.');
  }

  return mongoUri;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: getMongoUri(configService)
      })
    }),
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}

