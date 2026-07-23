import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  story: z.string().min(20, 'Story description must be at least 20 characters'),
  category: z.enum(['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment']),
  fundingGoal: z.number().min(1, 'Funding goal must be at least 1 credit'),
  minimumContribution: z.number().min(1, 'Minimum contribution must be at least 1 credit'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date format',
  }),
  rewardInfo: z.string().min(5, 'Reward info must be at least 5 characters'),
  imageUrl: z.string().url('Invalid image URL format'),
});

export const updateCampaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  story: z.string().min(20, 'Story description must be at least 20 characters').optional(),
  rewardInfo: z.string().min(5, 'Reward info must be at least 5 characters').optional(),
  imageUrl: z.string().url('Invalid image URL format').optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
