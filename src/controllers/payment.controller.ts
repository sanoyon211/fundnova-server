import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { PaymentService } from '../services/payment.service.js';
import { User } from '../models/user.model.js';
import { Payment } from '../models/payment.model.js';
import { AppError } from '../errors/app-error.js';
import { ENV } from '../config/env.config.js';

const stripeSecret = ENV.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const { packageId, amount: reqAmount, credits: reqCredits } = req.body;

    let amountInCents = 1000;
    let creditsToAdd = 100;

    if (packageId === 'pkg_10' || reqAmount === 10) {
      amountInCents = 1000;
      creditsToAdd = 100;
    } else if (packageId === 'pkg_25' || reqAmount === 25) {
      amountInCents = 2500;
      creditsToAdd = 300;
    } else if (packageId === 'pkg_60' || reqAmount === 60) {
      amountInCents = 6000;
      creditsToAdd = 800;
    } else if (packageId === 'pkg_110' || reqAmount === 110) {
      amountInCents = 11000;
      creditsToAdd = 1500;
    } else if (reqAmount && reqAmount > 0) {
      amountInCents = Math.round(reqAmount * 100);
      creditsToAdd = reqCredits || Math.round(reqAmount * 10);
    }

    const result = await PaymentService.createStripePaymentIntent({
      userId: String(userId),
      userEmail: req.user?.email || '',
      amountInCents,
      creditsToAdd,
      packageId: packageId || 'custom',
    });

    res.status(200).json({
      success: true,
      message: 'Stripe PaymentIntent generated successfully',
      data: result,
      clientSecret: result.clientSecret,
    });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event: any;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    if (event?.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};
      const userId = metadata.userId;
      const creditsToAdd = Number(metadata.creditsToAdd || metadata.credits || 0);

      if (userId && creditsToAdd > 0) {
        // Atomically increment user's credits and creditBalance
        await User.findByIdAndUpdate(userId, {
          $inc: { credits: creditsToAdd, creditBalance: creditsToAdd },
        });

        const user = await User.findById(userId);

        if (user) {
          await Payment.create({
            transactionId: paymentIntent.id,
            userEmail: user.email,
            userName: user.name,
            amount: paymentIntent.amount / 100,
            credits: creditsToAdd,
            paymentMethod: 'Stripe',
            status: 'succeeded',
          });
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const { transactionId, amount, credits } = req.body;

    const result = await PaymentService.confirmPaymentAndAllocateCredits(
      user.email,
      user.name,
      { transactionId, amount, credits }
    );

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and credits allocated to account',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPaymentHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const history = await PaymentService.getUserPaymentHistory(req.user!.email);

    res.status(200).json({
      success: true,
      message: 'Payment history fetched successfully',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export class PaymentController {
  static createPaymentIntent = createPaymentIntent;
  static stripeWebhook = stripeWebhook;
  static confirmPayment = confirmPayment;
  static getUserPaymentHistory = getUserPaymentHistory;
}
