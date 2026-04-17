import { useState, useEffect, useCallback } from 'react';
import { NBAGame, NBAStanding, NBASeries } from '../types';
import { nbaApi } from '../services/api';
import { withCache, TTL } from '../services/cacheService';

export function useNBAGames(date?: string) {
  const [games, setGames] = useState<NBAGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const key = `nba:games:${date ?? 'today'}`;
      const data = await withCache(key, TTL.NBA_GAMES, () => nbaApi.getGames(date));
      setGames(data.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetch(); }, [fetch]);

  return { games, loading, error, refresh: fetch };
}

export function useNBAStandings() {
  const [standings, setStandings] = useState<NBAStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const data = await withCache('nba:standings', TTL.NBA_STANDINGS, () => nbaApi.getStandings());
      setStandings(data.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { standings, loading, error, refresh: fetch };
}

export function useNBAPlayoffs() {
  const [series, setSeries] = useState<NBASeries[]>([]);
  const [season, setSeason] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const data = await withCache('nba:playoffs', 10 * 60, () => nbaApi.getPlayoffs());
      setSeries(data.data ?? []);
      setSeason(data.season ?? null);
    } catch (e: any) {
      setError(e.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { series, season, loading, error, refresh: fetch };
}
