import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, "Comentário não pode ser vazio").max(1000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const upsertRatingSchema = z.object({
  score: z.number().int().min(1, "Nota mínima é 1").max(5, "Nota máxima é 5"),
});

export type UpsertRatingInput = z.infer<typeof upsertRatingSchema>;
