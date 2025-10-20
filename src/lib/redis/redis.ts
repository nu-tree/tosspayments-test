import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

/**
 * Redis 클라이언트 인스턴스
 * 환경변수를 통해 설정 가능
 */
export const getRedisClient = (): Redis => {
  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  globalForRedis.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
  });

  globalForRedis.redis.on('error', (error) => {
    console.error('[REDIS] 연결 에러:', error);
  });

  globalForRedis.redis.on('connect', () => {
    console.log('[REDIS] 연결 성공');
  });

  return globalForRedis.redis;
};

/**
 * Redis 연결 종료
 */
export const closeRedisConnection = async (): Promise<void> => {
  if (globalForRedis.redis) {
    await globalForRedis.redis.quit();
    globalForRedis.redis = undefined;
  }
};
