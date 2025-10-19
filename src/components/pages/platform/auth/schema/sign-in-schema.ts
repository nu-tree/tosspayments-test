import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignInSchema = z.infer<typeof SignInSchema>;
