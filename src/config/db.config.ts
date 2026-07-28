import mongoose from 'mongoose';
import { ENV } from './env.config';
import { User } from '../models/user.model';

export const seedInitialUsers = async (): Promise<void> => {
  try {
    // Seed Admin Account
    const adminEmail = 'admin@fundnova.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Platform Administrator',
        email: adminEmail,
        password: 'AdminSecret123!',
        role: 'admin',
        credits: 1000,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      });
      console.log('👑 [Seeder] Default Admin account created (admin@fundnova.com / AdminSecret123!)');
    }

    // Seed Supporter Account
    const supporterEmail = 'supporter@fundnova.com';
    const supporterExists = await User.findOne({ email: supporterEmail });
    if (!supporterExists) {
      await User.create({
        name: 'Demo Supporter',
        email: supporterEmail,
        password: 'Supporter123!',
        role: 'supporter',
        credits: 50,
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
      });
      console.log('👤 [Seeder] Demo Supporter account created (supporter@fundnova.com / Supporter123!)');
    }

    // Seed Creator Account
    const creatorEmail = 'creator@fundnova.com';
    const creatorExists = await User.findOne({ email: creatorEmail });
    if (!creatorExists) {
      await User.create({
        name: 'Demo Creator',
        email: creatorEmail,
        password: 'Creator123!',
        role: 'creator',
        credits: 20,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      });
      console.log('🚀 [Seeder] Demo Creator account created (creator@fundnova.com / Creator123!)');
    }
  } catch (error) {
    console.error('⚠️ [Seeder] Error seeding default accounts:', error);
  }
};

export const connectDatabase = async (): Promise<void> => {
  // Reuse existing connection if already connected in serverless container
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = ENV.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URI || '';
    if (!mongoUri) {
      console.error('⚠️ [Database] MONODB_URI is missing in environment variables');
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);

    // Seed initial users
    await seedInitialUsers();
  } catch (error) {
    console.error('❌ [Database] MongoDB connection error:', error);
  }
};
