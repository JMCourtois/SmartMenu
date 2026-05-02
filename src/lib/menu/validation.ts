import { z } from "zod";

export const MenuItemFormSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2).max(120),
  description: z.string().max(700).optional(),
  priceCents: z.coerce.number().int().min(0).max(100000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isPromoted: z.coerce.boolean().default(false),
  isAvailable: z.coerce.boolean().default(true),
});

export const MenuCategoryFormSchema = z.object({
  menuVersionId: z.string().min(1),
  name: z.string().min(2).max(80),
});

export const TranslationFormSchema = z.object({
  menuItemId: z.string().min(1),
  locale: z.string().min(2).max(12),
  name: z.string().min(2).max(120),
  description: z.string().max(700).optional(),
});
