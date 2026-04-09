import { z } from "zod";

/*
Create Blood Request
*/

export const createRequestSchema = z.object({
  donorId: z.string(),
  requesterName: z.string(),
  requesterEmail: z.string().email(),
  requesterAge: z.number().min(18).max(65),
  requesterPhoneNumber: z.string().min(10),
  requesterLastDonationDate: z.string().datetime().optional(),
  requesterLocation: z.string(),
  requesterDivision: z.string(),
  requesterAddress: z.string(),
  isTermsAgreed: z.boolean(),
  hospitalName: z.string(),
  dateOfDonation: z.string().datetime(),
  hospitalAddress: z.string(),
  reason: z.string(),
});

/*
Update Request
*/

export const updateRequestStatusSchema = z.object({
  requestStatus: z.enum(["APPROVED", "REJECTED"]),
});
