import { useState, useEffect, useCallback } from 'react';
import { FootballMatch } from '../types';
import { footballApi } from '../services/api';
import { withCache, TTL } from '../services/cacheService';

interface UseMatchesOptions {
  leagueCode?: string;
  live?: boolean;
  refreshInterval?: number;
}

export function useMatches({ leagueCode, live = false, refreshInterval }: UseMatchesOptions = {}) {
  const [matches, setMatches] = useState<FootballMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const cacheKey = live ? 'football:live' : `football:today:${leagueCode ?? 'all'}`;
      const ttl = live ? TTL.LIVE : TTL.TODAY_MATCHES;

      const data = await withCache(cacheKey, ttl, () =>
        live ? footballApi.getLive() : footballApi.getToday(leagueCode),
      );
      setMatches(data.matches ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [leagueCode, live]);

  useEffect(() => {
    fetch();
    if (!refreshInterval) return;
    const id = setInterval(fetch, refreshInterval);
    return () => clearInterval(id);
  }, [fetch, refreshInterval]);

  return { matches, loading, error, refresh: fetch };
}

export function useLeagueMatches(leagueCode: string) {
  const [matches, setMatches] = useState<FootballMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const data = await withCache(
        `football:league:${leagueCode}`,
        TTL.LEAGUE_MATCHES,
        () => footballApi.getLeagueMatches(leagueCode),
      );
      setMatches(data.matches ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [leagueCode]);

  useEffect(() => { fetch(); }, [fetch]);

  return { matches, loading, error, refresh: fetch };
}
