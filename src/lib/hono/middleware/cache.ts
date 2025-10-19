import type { Context, Next } from 'hono';
import { getRedisClient } from '@/lib/redis/redis';

type CacheOptions = {
  ttl?: number;
  tags?: string[];
  methods?: string[];
  enabled?: boolean;
  skipPaths?: string[];
};

/**
 * 간단한 캐시 키 생성기
 */
const generateCacheKey = (c: Context): string => {
  return `cache:${c.req.method}:${c.req.path}`;
};

/**
 * Redis 기반 태그 캐시 미들웨어
 * 태그 기반으로 캐시 무효화를 효율적으로 처리
 */
export const cache = (options: CacheOptions = {}) => {
  const { ttl = 300, tags = [], methods = ['GET'], enabled = true, skipPaths = ['/health', '/ping'] } = options;

  return async (c: Context, next: Next) => {
    // 캐시 비활성화, 지원하지 않는 메서드, 스킵할 경로 체크
    if (!enabled || !methods.includes(c.req.method) || skipPaths.some((path) => c.req.path.includes(path))) {
      await next();
      return;
    }

    const redis = getRedisClient();
    const cacheKey = generateCacheKey(c);

    try {
      // 캐시 조회
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        const data = JSON.parse(cachedData);
        c.header('X-Cache', 'HIT');
        return c.json(data.body, data.status);
      }

      // 캐시 미스 - 원래 핸들러 실행
      await next();

      // 성공 응답만 캐시
      if (c.res.status >= 200 && c.res.status < 300) {
        const responseText = await c.res.clone().text();
        const cacheData = {
          body: JSON.parse(responseText),
          status: c.res.status,
          timestamp: Date.now(),
        };

        // 캐시 저장
        await redis.setex(cacheKey, ttl, JSON.stringify(cacheData));

        // 태그와 연결 (SET 사용으로 성능 개선)
        if (tags.length > 0) {
          for (const tag of tags) {
            await redis.sadd(`tag:${tag}`, cacheKey);
            await redis.expire(`tag:${tag}`, ttl);
          }
        }
      }

      c.header('X-Cache', 'MISS');
    } catch (error) {
      console.error('Cache error:', error);
      // 캐시 에러 시에도 원래 응답 진행
      if (!c.res.ok) {
        await next();
      }
    }
  };
};

/**
 * 태그 기반 캐시 무효화 (KEYS 명령어 제거)
 */
export const invalidateTags = (tags: string[]) => {
  return async (c: Context, next: Next) => {
    await next();

    if (c.res.status >= 200 && c.res.status < 300) {
      const redis = getRedisClient();

      try {
        for (const tag of tags) {
          const cacheKeys = await redis.smembers(`tag:${tag}`);
          if (cacheKeys.length > 0) {
            await redis.del(...cacheKeys);
            await redis.del(`tag:${tag}`);
            console.log(`Cache invalidated: ${cacheKeys.length} keys for tag "${tag}"`);
          }
        }
      } catch (error) {
        console.error('Cache invalidation error:', error);
      }
    }
  };
};

/**
 * 태그별 캐시 무효화 함수 (미들웨어 외부에서 사용)
 */
export const invalidateTagsAsync = async (tags: string[]): Promise<void> => {
  const redis = getRedisClient();
  try {
    for (const tag of tags) {
      const cacheKeys = await redis.smembers(`tag:${tag}`);
      if (cacheKeys.length > 0) {
        await redis.del(...cacheKeys);
        await redis.del(`tag:${tag}`);
        console.log(`Cache invalidated: ${cacheKeys.length} keys for tag "${tag}"`);
      }
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

/**
 * 전체 캐시 클리어 (개발/테스트용)
 */
export const clearAllCache = async (): Promise<void> => {
  const redis = getRedisClient();
  try {
    const cacheKeys = await redis.keys('cache:*');
    const tagKeys = await redis.keys('tag:*');

    if (cacheKeys.length > 0) await redis.del(...cacheKeys);
    if (tagKeys.length > 0) await redis.del(...tagKeys);

    console.log(`Cleared ${cacheKeys.length} cache keys and ${tagKeys.length} tag keys`);
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};
