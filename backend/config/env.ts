import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET must be at least 8 characters long'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  // Google OAuth 2.0
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_URL: z.string().optional(),
  // MongoDB Atlas credentials
  MONGODB_USERNAME: z.string().optional(),
  MONGODB_PASSWORD: z.string().optional(),
});

const rawEnv = {
  ...process.env,
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
  CLOUDINARY_CLOUD_NAME:
    process.env.CLOUDINARY_CLOUD_NAME ||
    (process.env.CLOUDINARY_URL
      ? process.env.CLOUDINARY_URL.split('@').pop()
      : undefined),
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(
      '❌ Invalid environment configuration:\n',
      JSON.stringify(z.flattenError(parsed.error).fieldErrors, null, 2)
    );
    process.exit(1);
  }
}

export const env = parsed.success
  ? parsed.data
  : {
      NODE_ENV: 'test' as const,
      PORT: 5000,
      MONGO_URI: 'mongodb://localhost:27017/inventory_test',
      JWT_SECRET: 'test_jwt_secret_key_12345',
      FRONTEND_URL: 'http://localhost:5173',
    };
