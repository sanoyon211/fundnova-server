import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/fundnova'),
  JWT_SECRET: z.string().default('fundnova_super_secret_jwt_key_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().default(''),
  IMGBB_API_KEY: z.string().default(''),
  CLIENT_URL: z.string().default('http://localhost:3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ [ENV Config] Environment variable validation failed:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const ENV = parsedEnv.data;
