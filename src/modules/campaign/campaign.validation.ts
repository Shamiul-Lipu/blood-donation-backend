import { z } from "zod";

export const createCampaignSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    goalAmount: z.number().positive(),
    deadline: z.string().datetime(),
    location: z.string().optional(),
    division: z.string().optional(),
  }),
});

export const updateCampaignSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    goalAmount: z.number().positive().optional(),
    deadline: z.string().datetime().optional(),
    location: z.string().optional(),
    division: z.string().optional(),
  }),
});
