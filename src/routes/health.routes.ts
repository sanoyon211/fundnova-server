import { Router, Request, Response, NextFunction } from 'express';
import { seedDatabase } from '../utils/seed';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'FundNova Server API is healthy and running!',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

router.post('/seed', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Successfully seeded platform users, campaigns, and notifications into MongoDB!',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
