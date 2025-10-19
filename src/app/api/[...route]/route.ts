import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { swaggerUI } from '@hono/swagger-ui';
import { logger } from '@/lib/hono/middleware/logger';
import { rateLimiter } from 'hono-rate-limiter';
import { cache } from '@/lib/hono/middleware/cache';
import { auth, AuthType } from '@/lib/auth';
import { cors } from 'hono/cors';
import { session } from '@/lib/hono/middleware/session';
import { HTTPException } from 'hono/http-exception';
import { otpRouter } from '@/lib/hono/api/service/otp';
import { usersRouter } from '@/lib/hono/api/service/users';

const app = new OpenAPIHono<{ Variables: AuthType }>().basePath('/api');
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.use('*', session);

app.use(
  '/auth/*', // or replace with "*" to enable cors for all routes
  cors({
    origin: baseUrl, // replace with your origin
    credentials: true,
  }),
);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-6',
    skip(c) {
      return process.env.NODE_ENV === 'development';
    },
    keyGenerator: (c) => {
      // Hono context에서 직접 IP 추출
      const cfIp = c.req.header('cf-connecting-ip');
      if (cfIp) return cfIp;

      const xff = c.req.header('x-forwarded-for');
      const xffIp = xff?.split(',')[0].trim();
      if (xffIp) return xffIp;

      const remoteIp = c.req.header('x-real-ip');
      if (remoteIp) return remoteIp;

      return 'unknown';
    },
  }),
);

app.use('*', logger);

// NOTE API 에러 처리 미들웨어
// [ ] 에러로그 관련 기능 추가 (에러 로그 저장)
// [ ] 에러로그 관련 관리자 기능 추가 (에러 로그 관리)

app.onError((err, c) => {
  console.error('API Error:', err);

  if (err instanceof HTTPException) {
    return c.json(
      {
        ok: false,
        error: {
          message: err.message,
          status: err.status,
          statusText: err.message,
          timestamp: new Date().toISOString(),
        },
      },
      err.status,
    );
  }

  // 예상치 못한 에러
  return c.json(
    {
      ok: false,
      error: {
        message: '서버에서 예상치 못한 오류가 발생했습니다.',
        status: 500,
        statusText: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { details: err.message }),
      },
    },
    500,
  );
});

// 404 핸들러
app.notFound((c) => {
  return c.json(
    {
      ok: false,
      error: {
        message: '요청한 API 엔드포인트를 찾을 수 없습니다.',
        status: 404,
        statusText: 'Not Found',
        timestamp: new Date().toISOString(),
      },
    },
    404,
  );
});

app.route('/otp', otpRouter);
app.route('/users', usersRouter);

// Swagger UI
app.get('/docs', swaggerUI({ url: '/api/doc' }));

// OpenAPI 문서 생성 (라우터 등록 후)
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'wefactory 쇼핑몰 템플릿',
    version: '1.0.0',
    description: '설명입니다',
  },
  servers: [{ url: `${baseUrl}/api`, description: '개발 서버' }],
});

const handler = handle(app);

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
