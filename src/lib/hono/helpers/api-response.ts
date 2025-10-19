/**
 * API 응답 헬퍼
 * 모든 API가 통일된 응답 구조를 반환하도록 돕는 유틸리티
 */

import { Context } from 'hono';

/**
 * API에서 사용하는 HTTP 상태 코드 타입
 * (Content가 있는 응답만 포함)
 */
type ApiStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 500;

/**
 * 성공 응답 타입
 */
export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
  status: number;
};

/**
 * 에러 응답 타입
 */
export type ApiErrorResponse = {
  ok: false;
  error: {
    message: string;
    status: number;
    statusText?: string;
    details?: unknown;
    timestamp: string;
  };
};

/**
 * API 응답 타입 (Result 패턴)
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 성공 응답 생성 헬퍼
 */
export function apiSuccess<T>(c: Context, data: T, status: ApiStatusCode = 200) {
  const response: ApiSuccessResponse<T> = {
    ok: true,
    data,
    status,
  };
  return c.json(response, status);
}

/**
 * 에러 응답 생성 헬퍼
 */
export function apiError(
  c: Context,
  message: string,
  status: ApiStatusCode = 500,
  details?: unknown,
  statusText?: string,
) {
  const response: ApiErrorResponse = {
    ok: false,
    error: {
      message,
      status,
      statusText,
      details,
      timestamp: new Date().toISOString(),
    },
  };
  return c.json(response, status);
}

/**
 * 공통 에러 응답 헬퍼들
 */
export const apiErrorHelpers = {
  badRequest: (c: Context, message: string = '잘못된 요청입니다.', details?: unknown) =>
    apiError(c, message, 400, details, 'Bad Request'),

  unauthorized: (c: Context, message: string = '인증이 필요합니다.') =>
    apiError(c, message, 401, undefined, 'Unauthorized'),

  forbidden: (c: Context, message: string = '접근 권한이 없습니다.') =>
    apiError(c, message, 403, undefined, 'Forbidden'),

  notFound: (c: Context, message: string = '요청한 리소스를 찾을 수 없습니다.') =>
    apiError(c, message, 404, undefined, 'Not Found'),

  conflict: (c: Context, message: string = '리소스 충돌이 발생했습니다.', details?: unknown) =>
    apiError(c, message, 409, details, 'Conflict'),

  serverError: (c: Context, message: string = '서버에서 오류가 발생했습니다.', details?: unknown) =>
    apiError(c, message, 500, details, 'Internal Server Error'),
};

