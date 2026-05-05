import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import mongoose, { Schema } from 'mongoose';

type SeedLocation = {
  country: string;
  state: string;
  district: string;
  city: string;
  pincode?: string;
  lat?: number;
  lng?: number;
};

const locationSchema = new Schema(
  {
    country: { type: String, required: true, trim: true, default: 'India' },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
      _id: false,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: 'locations',
    timestamps: true,
  },
);

locationSchema.index({ state: 1 });
locationSchema.index({ district: 1 });
locationSchema.index({ city: 1 });
locationSchema.index({ pincode: 1 });
locationSchema.index(
  { location: '2dsphere' },
  { sparse: true, partialFilterExpression: { location: { $exists: true } } },
);
locationSchema.index(
  { country: 1, state: 1, district: 1, city: 1, pincode: 1 },
  { unique: true },
);

async function seedLocations() {
  await loadLocalEnv();
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      'Missing MONGODB_URI. Set it before running npm run seed:locations.',
    );
  }

  const seedPath = join(__dirname, 'data', 'india-locations.seed.json');
  const seedJson = await readFile(seedPath, 'utf8');
  const locations = JSON.parse(seedJson) as SeedLocation[];
  const LocationModel = mongoose.model('Location', locationSchema);

  await mongoose.connect(mongoUri);
  await LocationModel.init();

  const operations = locations.map((location) => ({
    updateOne: {
      filter: {
        country: location.country,
        state: location.state,
        district: location.district,
        city: location.city,
        pincode: location.pincode,
      },
      update: {
        $set: {
          country: location.country,
          state: location.state,
          district: location.district,
          city: location.city,
          pincode: location.pincode,
          location:
            location.lat !== undefined && location.lng !== undefined
              ? {
                  type: 'Point' as const,
                  coordinates: [location.lng, location.lat],
                }
              : undefined,
          isActive: true,
        },
      },
      upsert: true,
    },
  }));

  const result = await LocationModel.bulkWrite(operations, { ordered: false });
  await mongoose.disconnect();

  process.stdout.write(
    `Seeded locations. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}\n`,
  );
}

async function loadLocalEnv(): Promise<void> {
  const envPath = join(process.cwd(), '.env');
  const envFile = await readFile(envPath, 'utf8').catch(() => '');

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

seedLocations().catch(async (error: unknown) => {
  await mongoose.disconnect();
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Location seed failed.'}\n`,
  );
  process.exit(1);
});
