import Redis from 'ioredis';

// Singleton instance initialized when needed
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Fallback gracefully without aggressive failing
        return Math.min(times * 50, 2000);
      }
    });

    redisClient.on('error', (err) => {
      console.warn('Redis connection error. Rate limiting will bypass or fail gracefully.', err);
    });
  }
  return redisClient;
}

/**
 * Simple Token Bucket rate limiter using Redis
 */
export async function rateLimit(identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const redis = getRedisClient();
    const key = `rate_limit:${identifier}`;
    
    const currentCount = await redis.incr(key);
    if (currentCount === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    if (currentCount > limit) {
      return false; // Rate limit exceeded
    }
    
    return true; // Allowed
  } catch (error) {
    // If Redis fails, we default to allow to not block critical flows, 
    // but log the error heavily. (Or we can be strict and fail open/closed)
    console.error('Rate limiting dependency failed', error);
    return true; 
  }
}
