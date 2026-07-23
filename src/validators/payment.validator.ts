import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  credits: z.number().min(10, 'Credits must be at least 10'),
});

export const confirmPaymentSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.number().min(1, 'Amount is required'),
  credits: z.number().min(10, 'Credits is required'),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
