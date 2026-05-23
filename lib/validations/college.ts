import { z } from "zod";

export const collegeListQuerySchema = z.object({
  ids: z.string().optional(),
  search: z.string().optional().default(""),
  state: z.string().optional().default(""),
  course: z.string().optional().default(""),
  minFees: z.coerce.number().int().min(0).optional(),
  maxFees: z.coerce.number().int().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  minRank: z.coerce.number().int().min(1).optional(),
  maxRank: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(24).optional().default(12),
  sort: z
    .enum(["ranking", "fees-asc", "fees-desc", "rating", "name"])
    .optional()
    .default("ranking")
});

export type CollegeListQuery = z.infer<typeof collegeListQuerySchema>;
