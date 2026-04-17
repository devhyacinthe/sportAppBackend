import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY ?? '' },
  timeout: 10000,
});

// Free tier league codes
export const LEAGUES = {
  PL:  { name: 'Premier League',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', id: 2021 },
  PD:  { name: 'La Liga',         flag: '🇪🇸', id: 2014 },
  FL1: { name: 'Ligue 1',         flag: '🇫🇷', id: 2015 },
  SA:  { name: 'Serie A',         flag: '🇮🇹', id: 2019 },
  BL1: { name: 'Bundesliga',      flag: '🇩🇪', id: 2002 },
  WC:  { name: 'World Cup',       flag: '🌍', id: 2000 },
  CL:  { name: 'Champions League',flag: '⭐', id: 2001 },
} as const;

export type LeagueCode = keyof typeof LEAGUES;

export async function getLiveMatches() {
  const { data } = await client.get('/matches', {
    params: { status: 'IN_PLAY,PAUSED' },
  });
  return data;
}

export async function getTodayMatches(leagueCode?: string) {
  const today = new Date().toISOString().slice(0, 10);
  const params: Record<string, string> = { dateFrom: today, dateTo: today };
  const path = leagueCode
    ? `/competitions/${leagueCode}/matches`
    : '/matches';
  const { data } = await client.get(path, { params });
  return data;
}

export async function getCompetitionMatches(leagueCode: string, matchday?: number) {
  const params: Record<string, string | number> = {};
  if (matchday) params.matchday = matchday;
  else params.status = 'SCHEDULED,IN_PLAY,PAUSED,FINISHED';
  const { data } = await client.get(`/competitions/${leagueCode}/matches`, { params });
  return data;
}

export async function getMatchDetail(matchId: number) {
  const { data } = await client.get(`/matches/${matchId}`);
  return data;
}

export async function getStandings(leagueCode: string) {
  const { data } = await client.get(`/competitions/${leagueCode}/standings`);
  return data;
}
