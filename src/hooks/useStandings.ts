import { useState, useEffect, useCallback } from 'react';
import { Standing, StandingsGroup } from '../types';
import { footballApi } from '../services/api';
import { withCache, TTL } from '../services/cacheService';

export function useStandings(leagueCode: string) {
  const [groups, setGroups] = useState<StandingsGroup[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const data = await withCache(
        `football:standings:${leagueCode}`,
        TTL.STANDINGS,
        () => footballApi.getStandings(leagueCode),
      );
      const allGroups: StandingsGroup[] = data.standings ?? [];
      setGroups(allGroups);
      setStandings(allGroups[0]?.table ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [leagueCode]);

  useEffect(() => { fetch(); }, [fetch]);

  return { standings, groups, loading, error, refresh: fetch };
}
