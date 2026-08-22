/**
 * In-Memory Token Bucket / Sliding Window Rate Limiter
 * Sunlit Enterprise Engineering Platform — Public Hardening
 * Note: No external database or Redis dependency is required for public tools.
 */

interface RateBucket {
  tokens: number;
  lastRefillTimestamp: number;
}

class InMemoryRateLimiter {
  private buckets = new Map<string, RateBucket>();
  private maxBuckets = 5000;

  /**
   * Check and consume rate limit token for a given identifier (e.g., client IP or anonymous session).
   * @param identifier Client IP or request identifier
   * @param limit Maximum tokens allowed in the window (default: 60)
   * @param windowSeconds Window length in seconds (default: 60)
   */
  async check(identifier: string, limit = 60, windowSeconds = 60): Promise<boolean> {
    const now = Date.now();
    const refillRatePerMs = limit / (windowSeconds * 1000);

    // Evict old entries if cache is growing too large
    if (this.buckets.size > this.maxBuckets) {
      const oldestCutoff = now - windowSeconds * 1000 * 2;
      for (const [key, bucket] of this.buckets.entries()) {
        if (bucket.lastRefillTimestamp < oldestCutoff) {
          this.buckets.delete(key);
        }
      }
    }

    let bucket = this.buckets.get(identifier);
    if (!bucket) {
      bucket = {
        tokens: limit - 1,
        lastRefillTimestamp: now,
      };
      this.buckets.set(identifier, bucket);
      return true;
    }

    // Refill tokens based on elapsed time
    const elapsedMs = now - bucket.lastRefillTimestamp;
    const tokensToAdd = elapsedMs * refillRatePerMs;
    bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
    bucket.lastRefillTimestamp = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }

    return false; // Limit exceeded
  }

  reset() {
    this.buckets.clear();
  }
}

export const inMemoryRateLimiter = new InMemoryRateLimiter();
