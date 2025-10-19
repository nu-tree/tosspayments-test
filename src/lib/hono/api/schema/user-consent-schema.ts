import { z } from '@hono/zod-openapi';

export const CreateUserConsentBodySchema = z
  .object({
    userId: z.string().openapi({ description: '사용자 ID' }),
    consents: z
      .array(
        z.object({
          termsKey: z.string().openapi({ description: '약관 키 (예: terms_of_service, privacy_policy)' }),
          agreed: z.boolean().openapi({ description: '동의 여부' }),
        }),
      )
      .openapi({ description: '약관 동의 목록' }),
  })
  .openapi({
    description: '사용자 약관 동의 생성 요청',
  });

export type CreateUserConsentBodySchema = z.infer<typeof CreateUserConsentBodySchema>;

