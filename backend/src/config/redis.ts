import { Redis } from '@upstash/redis';

const memCache = new Map<string, { value: string; expiresAt: number }>();

let upstash: Redis | null = null;

function getUpstash(): Redis | null {
  if (upstash) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  upstash = new Redis({ url, token });
  return upstash;
}

export async function cacheGet(key: string): Promise<string | null> {
  const redis = getUpstash();
  if (redis) {
    try {
      const val = await redis.get<string>(key);
      return val ?? null;
    } catch {}
  }
  const entry = memCache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.value;
  return null;
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const redis = getUpstash();
  if (redis) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    } catch {}
  }
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}
