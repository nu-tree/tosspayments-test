import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// OTP 발송 요청 스키마
export const SendOTPSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
});

// OTP 검증 요청 스키마
export const VerifyOTPSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  code: z.string().length(6, '6자리 인증 코드를 입력해주세요'),
});

// OTP 발송 라우트
export const sendOTPRoute = createRoute({
  method: 'post',
  path: '/send',
  tags: ['OTP'],
  summary: 'OTP 코드 발송',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SendOTPSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OTP 발송 성공',
    },
    400: {
      description: '잘못된 요청',
    },
    500: {
      description: '서버 오류',
    },
  },
});

// OTP 검증 라우트
export const verifyOTPRoute = createRoute({
  method: 'post',
  path: '/verify',
  tags: ['OTP'],
  summary: 'OTP 코드 검증',
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyOTPSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OTP 검증 성공',
    },
    400: {
      description: '잘못된 요청',
    },
    404: {
      description: 'OTP 코드를 찾을 수 없음',
    },
    500: {
      description: '서버 오류',
    },
  },
});

// 타입 추출
export type SendOTPSchema = z.infer<typeof SendOTPSchema>;
export type VerifyOTPSchema = z.infer<typeof VerifyOTPSchema>;

