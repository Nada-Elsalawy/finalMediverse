
import { z } from "zod";

export const scheme = z.object({
  national_id: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{14}$/.test(val), {
      message: "National ID must be 14 digits",
    }),
});