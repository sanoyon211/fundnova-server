import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health.route.js';
import authRouter from './routes/auth.route.js';
import campaignRouter from './routes/campaign.route.js';
import contributionRouter from './routes/contribution.route.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ENV } from './config/env.config.js';

const app: Application = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:3000'],
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
app.use('/api/auth', authRouter);
app.use('/api/campaigns', campaignRouter);
app.use('/api/contributions', contributionRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
