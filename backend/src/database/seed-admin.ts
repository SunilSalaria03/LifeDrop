import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import mongoose, { Schema } from 'mongoose';

enum AuthProvider {
  Phone = 'phone',
  Google = 'google',
}

enum UserRole {
  Admin = 'admin',
}

type UserRecord = {
  name?: string;
  email?: string;
  phone?: string;
  authProvider: AuthProvider;
  role: UserRole;
  phoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
};

const userSchema = new Schema<UserRecord>(
  {
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },
    role: { type: String, enum: Object.values(UserRole), required: true },
    phoneVerified: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });

async function seedAdmin() {
  await loadLocalEnv();
  const mongoUri = process.env.MONGODB_URI;
  const adminName = process.env.ADMIN_NAME?.trim() || 'LifeDrop Admin';
  const adminEmail = normalizeOptional(process.env.ADMIN_EMAIL);
  const adminPhone = normalizeOptional(process.env.ADMIN_PHONE);

  if (!mongoUri) {
    throw new Error(
      'Missing MONGODB_URI. Set it before running npm run seed:admin.',
    );
  }

  if (!adminEmail && !adminPhone) {
    throw new Error(
      'Missing admin identity. Set ADMIN_EMAIL or ADMIN_PHONE before running npm run seed:admin.',
    );
  }

  const UserModel = mongoose.model<UserRecord>('User', userSchema);

  await mongoose.connect(mongoUri);
  await UserModel.init();

  const lookup = adminPhone
    ? { phone: adminPhone }
    : { email: adminEmail as string };

  const authProvider = adminPhone ? AuthProvider.Phone : AuthProvider.Google;
  const update: Partial<UserRecord> = {
    name: adminName,
    authProvider,
    role: UserRole.Admin,
    phoneVerified: Boolean(adminPhone),
    isProfileCompleted: true,
    isBlocked: false,
  };

  if (adminEmail) {
    update.email = adminEmail;
  }

  if (adminPhone) {
    update.phone = adminPhone;
  }

  const admin = await UserModel.findOneAndUpdate(
    lookup,
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).exec();

  await mongoose.disconnect();

  process.stdout.write(
    `Admin user ready. id: ${admin.id}, email: ${admin.email ?? 'not set'}, phone: ${admin.phone ?? 'not set'}\n`,
  );
}

function normalizeOptional(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
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

seedAdmin().catch(async (error: unknown) => {
  await mongoose.disconnect();
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Admin seed failed.'}\n`,
  );
  process.exit(1);
});
