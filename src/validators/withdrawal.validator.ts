import { z } from 'zod';

export const createWithdrawalSchema = z.object({
  withdrawalCredit: z.number().min(200, 'Minimum withdrawal threshold is 200 credits ($10)'),
  paymentSystem: z.enum(['Stripe', 'Bkash', 'Rocket', 'Nagad']),
  accountNumber: z.string().min(4, 'Account number must be at least 4 digits'),
});

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
