import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export type SignInSchema = z.infer<typeof SignInSchema>;
