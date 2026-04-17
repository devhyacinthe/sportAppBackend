import Redis from 'ioredis';

// In-memory fallback when Redis is unavailable
const memCache = new Map<string, { value: string; expiresAt: number }>();

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  if (!process.env.REDIS_URL) return null;

  const client = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 3000,
  });

  client.on('error', () => {
    redisClient = null;
  });

  client.on('connect', () => {
    console.log('[Redis] Connected');
    redisClient = client;
  });

  client.connect().catch(() => {});
  return client;
}

export async function cacheGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (redis) {
    try {
      return await redis.get(key);
    } catch {
      // fall through to memory cache
    }
  }
  const entry = memCache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.value;
  return null;
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(key, value, 'EX', ttlSeconds);
      return;
    } catch {
      // fall through to memory cache
    }
  }
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}
