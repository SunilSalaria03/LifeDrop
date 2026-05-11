import { ConfigService } from '@nestjs/config';

export function getMongoUri(configService: ConfigService): string {
  const mongoUri = configService.get<string>('MONGODB_URI');

  if (!mongoUri) {
    throw new Error(
      'Missing MONGODB_URI. Create backend/.env from backend/.env.example and set MONGODB_URI.',
    );
  }

  return mongoUri;
}
