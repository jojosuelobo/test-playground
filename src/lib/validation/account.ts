import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const updateAccountSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres"),
  phone: optionalText(30),
  headline: optionalText(60),
  bio: optionalText(500),
  websiteUrl: optionalText(200),
  facebookUsername: optionalText(100),
  instagramUsername: optionalText(100),
  linkedinUrl: optionalText(200),
  tiktokUsername: optionalText(100),
  xUsername: optionalText(100),
  youtubeUsername: optionalText(100),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
