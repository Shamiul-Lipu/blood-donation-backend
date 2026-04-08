import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
    isAccountActive: z.boolean().optional(),
  }),
});
