import { supabase } from '../lib/supabase';

export const TTL = {
  LIVE:           60,        // 1 min  — scores en direct
  TODAY_MATCHES:  5 * 60,    // 5 min  — matchs du jour
  LEAGUE_MATCHES: 10 * 60,   // 10 min — matchs d'une compétition
  STANDINGS:      60 * 60,   // 1 h    — classements
  NBA_GAMES:      5 * 60,    // 5 min  — matchs NBA
  NBA_STANDINGS:  60 * 60,   // 1 h    — classements NBA
};

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from('cache')
      .select('data, expires_at')
      .eq('key', key)
      .single();

    if (error || !data) return null;
    if (new Date(data.expires_at) < new Date()) return null;

    return data.data as T;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  try {
    const expires_at = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    await supabase
      .from('cache')
      .upsert({ key, data: value, expires_at, updated_at: new Date().toISOString() });
  } catch {
    // cache write failure is non-blocking
  }
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}
