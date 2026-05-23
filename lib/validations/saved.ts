import { z } from "zod";

export const saveCollegeSchema = z.object({
  collegeId: z.string().min(1)
});

export const collectionSchema = z.object({
  name: z.string().min(2).max(50)
});

export const assignCollectionSchema = z.object({
  collegeId: z.string().min(1)
});
