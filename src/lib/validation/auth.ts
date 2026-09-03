import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  phone: z.string().trim().min(1).optional().or(z.literal("")),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;
