import { createRoute } from '@hono/zod-openapi';
import { confirmPaymentBodySchema, confirmPaymentResponseSchema } from '../schema/payments-schema';

/**
 * 결제 승인 라우트
 */
export const confirmPaymentRoute = createRoute({
  method: 'post',
  path: '/confirm',
  tags: ['Payments'],
  summary: '결제 승인',
  description: 'Toss Payments 결제 승인 API',
  request: {
    body: {
      content: {
        'application/json': {
          schema: confirmPaymentBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '결제 승인 성공',
      content: {
        'application/json': {
          schema: confirmPaymentResponseSchema,
        },
      },
    },
    400: {
      description: '잘못된 요청',
    },
    404: {
      description: '주문 정보를 찾을 수 없음',
    },
    500: {
      description: '서버 오류',
    },
  },
});

