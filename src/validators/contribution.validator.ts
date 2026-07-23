import { z } from 'zod';

export const createContributionSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  contributionAmount: z.number().min(1, 'Contribution amount must be at least 1 credit'),
});

export type CreateContributionInput = z.infer<typeof createContributionSchema>;
