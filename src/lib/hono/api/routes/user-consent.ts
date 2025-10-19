import { createRoute, z } from '@hono/zod-openapi';
import { CreateUserConsentBodySchema } from '../schema/user-consent-schema';

export const createUserConsent = createRoute({
  method: 'post',
  path: '/',
  tags: ['UserConsent'],
  summary: '사용자 약관 동의 생성',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserConsentBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '사용자 약관 동의 생성 성공',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            count: z.number(),
          }),
        },
      },
    },
    400: {
      description: '잘못된 요청',
    },
    500: {
      description: '서버 에러',
    },
  },
});
