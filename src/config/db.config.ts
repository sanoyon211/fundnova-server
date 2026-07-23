import mongoose from 'mongoose';
import { ENV } from './env.config.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [Database] Mongoose disconnected from MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 [Database] Mongoose reconnected to MongoDB');
    });

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
  } catch (error) {
    console.error('❌ [Database] MongoDB connection error:', error);
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
