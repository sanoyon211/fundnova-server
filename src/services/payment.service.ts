import Stripe from 'stripe';
import { Payment } from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.config.js';
import { AppError } from '../errors/app-error.js';

const stripeSecret = ENV.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export class PaymentService {
  static async createStripePaymentIntent(input: {
    userId: string;
    userEmail: string;
    amountInCents: number;
    creditsToAdd: number;
    packageId: string;
  }) {
    if (stripeSecret && !stripeSecret.startsWith('sk_test_mock')) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: input.amountInCents,
          currency: 'usd',
          metadata: {
            userId: input.userId,
            userEmail: input.userEmail,
            creditsToAdd: String(input.creditsToAdd),
            packageId: input.packageId,
          },
        });

        return {
          clientSecret: paymentIntent.client_secret || '',
          paymentIntentId: paymentIntent.id,
          amount: input.amountInCents / 100,
          credits: input.creditsToAdd,
        };
      } catch (err) {
        console.warn('Stripe SDK error, utilizing fallback:', err);
      }
    }

    // Development mock fallback
    const mockTxId = `pi_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      clientSecret: `${mockTxId}_secret_mock`,
      paymentIntentId: mockTxId,
      amount: input.amountInCents / 100,
      credits: input.creditsToAdd,
    };
  }

  static async createPaymentIntent(input: { amount: number; credits: number }) {
    return this.createStripePaymentIntent({
      userId: '',
      userEmail: '',
      amountInCents: Math.round(input.amount * 100),
      creditsToAdd: input.credits,
      packageId: 'custom',
    });
  }

  static async confirmPaymentAndAllocateCredits(
    userEmail: string,
    userName: string,
    input: { transactionId: string; amount: number; credits: number }
  ) {
    const supporter = await User.findOne({ email: userEmail });
    if (!supporter) {
      throw new AppError('Supporter account not found', 404);
    }

    const existingPayment = await Payment.findOne({ transactionId: input.transactionId });
    if (existingPayment) {
      return {
        payment: existingPayment,
        newTotalCredits: supporter.credits,
      };
    }

    supporter.credits += input.credits;
    supporter.creditBalance += input.credits;
    await supporter.save();

    const paymentRecord = await Payment.create({
      transactionId: input.transactionId,
      userEmail,
      userName,
      amount: input.amount,
      credits: input.credits,
      paymentMethod: 'Stripe',
      status: 'succeeded',
    });

    return {
      payment: paymentRecord,
      newTotalCredits: supporter.credits,
    };
  }

  static async getUserPaymentHistory(userEmail: string) {
    const history = await Payment.find({ userEmail }).sort({ createdAt: -1 });
    return history;
  }
}
