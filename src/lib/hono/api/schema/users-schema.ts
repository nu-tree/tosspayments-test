import { z } from '@hono/zod-openapi';

// 스키마 정의
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.email(),
  phoneNumber: z.string().nullable(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});


export type UserProfileSchema = z.infer<typeof UserProfileSchema>;