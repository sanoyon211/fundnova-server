import { z } from 'zod';

export const createReportSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters long')
    .max(500, 'Reason cannot exceed 500 characters'),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
