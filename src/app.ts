import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import healthRouter from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import pledgeRoutes from './routes/pledge.routes';
import uploadRoutes from './routes/upload.routes';
import contributionRouter from './routes/contribution.routes';
import paymentRoutes from './routes/payment.routes';
import withdrawalRouter from './routes/withdrawal.routes';
import adminRoutes from './routes/admin.routes';
import notificationRouter from './routes/notification.routes';
import reportRouter from './routes/report.routes';
import { errorHandler } from './middleware/error.middleware';
import { ENV } from './config/env.config';

const app: Application = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:3000'].filter(Boolean),
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads safely for local / serverless
try {
  const uploadsPath = path.join(process.cwd(), 'public/uploads');
  if (fs.existsSync(uploadsPath)) {
    app.use('/uploads', express.static(uploadsPath));
  }
} catch (e) {
  // Ignore filesystem static serve errors in read-only serverless environments
}

// Root Welcome Route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🚀 FundNova Express API Server is Live and Running!',
    healthCheck: '/api/health',
    campaigns: '/api/campaigns',
  });
});

// API Routes
app.use('/api', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contributions', contributionRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/withdrawals', withdrawalRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRouter);
app.use('/api/reports', reportRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
