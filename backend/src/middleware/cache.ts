import { Request, Response, NextFunction } from 'express';
import { cacheGet, cacheSet } from '../config/redis';

export function withCache(ttlSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `sportapp:${req.originalUrl}`;
    const cached = await cacheGet(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.json(JSON.parse(cached));
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      cacheSet(key, JSON.stringify(body), ttlSeconds).catch(() => {});
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}
