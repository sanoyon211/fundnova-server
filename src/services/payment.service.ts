import Stripe from 'stripe';
import { Payment } from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.config.js';
import { CreatePaymentIntentInput, ConfirmPaymentInput } from '../validators/payment.validator.js';
import { AppError } from '../errors/app-error.js';

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export class PaymentService {
  static async createPaymentIntent(input: CreatePaymentIntentInput) {
    try {
      if (ENV.STRIPE_SECRET_KEY && !ENV.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(input.amount * 100), // convert to cents
          currency: 'usd',
          metadata: {
            credits: String(input.credits),
          },
        });

        return {
          clientSecret: paymentIntent.client_secret,
          transactionId: paymentIntent.id,
        };
      }
    } catch (err) {
      console.warn('Stripe SDK fallback activated:', err);
    }

    // Mock client secret fallback for development testing
    const mockTxId = `pi_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      clientSecret: `${mockTxId}_secret_mock`,
      transactionId: mockTxId,
    };
  }

  static async confirmPaymentAndAllocateCredits(
    userEmail: string,
    userName: string,
    input: ConfirmPaymentInput
  ) {
    const supporter = await User.findOne({ email: userEmail });
    if (!supporter) {
      throw new AppError('Supporter account not found', 404);
    }

    // Avoid duplicate payment processing for transactionId
    const existingPayment = await Payment.findOne({ transactionId: input.transactionId });
    if (existingPayment) {
      return {
        payment: existingPayment,
        newTotalCredits: supporter.credits,
      };
    }

    // Add purchased credits to Supporter's account
    supporter.credits += input.credits;
    await supporter.save();

    // Create payment history record
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

  static async handleStripeWebhook(payload: Buffer, sig: string, webhookSecret: string) {
    try {
      const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userEmail = paymentIntent.receipt_email || paymentIntent.metadata?.userEmail;
        const credits = Number(paymentIntent.metadata?.credits || 0);

        if (userEmail && credits > 0) {
          const supporter = await User.findOne({ email: userEmail });
          if (supporter) {
            supporter.credits += credits;
            await supporter.save();

            await Payment.create({
              transactionId: paymentIntent.id,
              userEmail,
              userName: supporter.name,
              amount: paymentIntent.amount / 100,
              credits,
              paymentMethod: 'Stripe Webhook',
              status: 'succeeded',
            });
          }
        }
      }
      return { received: true };
    } catch (err: any) {
      throw new AppError(`Stripe Webhook Error: ${err.message}`, 400);
    }
  }
}
