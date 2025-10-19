import { OpenAPIHono, RouteHandler, RouteConfig } from '@hono/zod-openapi';
import { Context } from 'hono';
import { AuthType } from '@/lib/auth';

/**
 * 인증이 포함된 Hono Context 타입
 */
export type AuthContext = Context<{ Variables: AuthType }>;

/**
 * 인증이 포함된 OpenAPIHono 인스턴스 생성 함수
 */
export const createAuthOpenAPIHono = () => new OpenAPIHono<{ Variables: AuthType }>();

/**
 * 인증이 포함된 RouteHandler 타입
 */
export type AuthRouteHandler<T extends RouteConfig> = RouteHandler<T, { Variables: AuthType }>;

/**
 * API 응답 타입 (서버에서 클라이언트로 전달되는 통일된 구조)
 */
export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
  status: number;
};

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

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
