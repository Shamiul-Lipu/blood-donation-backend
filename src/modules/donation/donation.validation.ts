import { z } from "zod";

export const createDonationSchema = z.object({
  body: z.object({
    campaignId: z.string(),
    amount: z.number().positive(),
  }),
});

export const initPaymentSchema = z.object({
  body: z.object({
    donationId: z.string(),
  }),
});
