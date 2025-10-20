import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

/**
 * 결제 승인 요청 스키마
 */
export const ConfirmPaymentSchema = z.object({
  paymentKey: z.string().min(1, '결제 키가 필요합니다.'),
  orderId: z.string().min(1, '주문번호가 필요합니다.'),
  amount: z.string().min(1, '결제 금액이 필요합니다.'),
});

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
          schema: ConfirmPaymentSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '결제 승인 성공',
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

// 타입 추출
export type ConfirmPaymentSchema = z.infer<typeof ConfirmPaymentSchema>;

