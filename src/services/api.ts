import axios from 'axios';

// Update this to your machine's IP when testing on a physical device
// e.g. 'http://192.168.1.x:3001'
const BASE_URL = 'https://sportapp-theta.vercel.app/';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// ─── Football ────────────────────────────────────────────────────────────────

export const footballApi = {
  getLive: () =>
    api.get('/api/football/live').then(r => r.data),

  getToday: (leagueCode?: string) =>
    api.get('/api/football/today', { params: leagueCode ? { league: leagueCode } : {} }).then(r => r.data),

  getLeagueMatches: (leagueCode: string, matchday?: number) =>
    api
      .get(`/api/football/competitions/${leagueCode}/matches`, {
        params: matchday ? { matchday } : {},
      })
      .then(r => r.data),

  getMatchDetail: (matchId: number) =>
    api.get(`/api/football/matches/${matchId}`).then(r => r.data),

  getStandings: (leagueCode: string) =>
    api.get(`/api/football/competitions/${leagueCode}/standings`).then(r => r.data),
};

// ─── NBA ─────────────────────────────────────────────────────────────────────

export const nbaApi = {
  getGames: (date?: string) =>
    api.get('/api/nba/games', { params: date ? { date } : {} }).then(r => r.data),

  getGameDetail: (gameId: number) =>
    api.get(`/api/nba/games/${gameId}`).then(r => r.data),

  getStandings: (season?: number) =>
    api.get('/api/nba/standings', { params: season ? { season } : {} }).then(r => r.data),

  getPlayoffs: (season?: number) =>
    api.get('/api/nba/playoffs', { params: season ? { season } : {} }).then(r => r.data),
};
