import app from '../src/app';
import { connectDatabase } from '../src/config/db.config';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('Database connection error in Vercel handler:', err);
  }
  return app(req, res);
}
