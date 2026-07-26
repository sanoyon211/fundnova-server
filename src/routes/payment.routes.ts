import express, { Router } from 'express';
import {
  createPaymentIntent,
  stripeWebhook,
  confirmPayment,
  getUserPaymentHistory,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/confirm', protect, confirmPayment);
router.get('/history', protect, getUserPaymentHistory);

export default router;
