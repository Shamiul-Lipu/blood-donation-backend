import { z } from "zod";

/*
Update My Profile
*/

export const updateMyProfileSchema = z.object({
  // User fields
  name: z.string().optional(),
  profileImage: z.string().url().optional(),
  availability: z.boolean().optional(),
  isDonor: z.boolean().optional(),
  location: z.string().optional(),
  division: z.string().optional(),
  address: z.string().optional(),

  // Profile fields
  bio: z.string().optional(),
  phoneNumber: z.string().min(10).optional(),
  age: z.number().min(18).max(65).optional(),
  lastDonationDate: z.string().datetime().optional(),
});

/*
Donor Query Schema
*/

// export const getDonorQuerySchema = z.object({
//   query: z.object({
//     bloodType: z.string().optional(),

//     division: z.string().optional(),

//     location: z.string().optional(),

//     page: z.coerce.number().min(1).default(1),

//     limit: z.coerce.number().min(1).max(50).default(10),
//   }),
// });
