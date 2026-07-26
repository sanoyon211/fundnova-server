import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health.route.js';
import authRoutes from './routes/auth.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import pledgeRoutes from './routes/pledge.routes.js';
import contributionRouter from './routes/contribution.route.js';
import paymentRouter from './routes/payment.route.js';
import withdrawalRouter from './routes/withdrawal.route.js';
import adminRouter from './routes/admin.route.js';
import notificationRouter from './routes/notification.route.js';
import reportRouter from './routes/report.route.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ENV } from './config/env.config.js';

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

// API Routes
app.use('/api', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/contributions', contributionRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/withdrawals', withdrawalRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/reports', reportRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
