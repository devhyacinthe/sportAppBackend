import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.balldontlie.io/v1',
  headers: { Authorization: process.env.NBA_API_KEY ?? '' },
  timeout: 15000,
});

export function currentSeason(): number {
  const now = new Date();
  // NBA season year = year it started (Oct). April 2026 → season 2025 (Oct 2025 start)
  return now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
}

interface TopScorer {
  player: string;
  pts: number;
}

async function fetchTopScorers(
  games: any[],
): Promise<Map<number, { home: TopScorer | null; visitor: TopScorer | null }>> {
  const gameIds = games.map(g => g.id);
  const allStats: any[] = [];
  let cursor: number | null = null;

  for (let i = 0; i < 5; i++) {
    const idsQuery = gameIds.map(id => `game_ids[]=${id}`).join('&');
    const cursorQuery = cursor ? `&cursor=${cursor}` : '';
    const { data } = await client.get(`/stats?per_page=100&${idsQuery}${cursorQuery}`);
    allStats.push(...(data.data ?? []));
    if (!data.meta?.next_cursor) break;
    cursor = data.meta.next_cursor;
  }

  const statsByGame = new Map<number, any[]>();
  for (const stat of allStats) {
    const gid = stat.game?.id;
    if (!gid) continue;
    if (!statsByGame.has(gid)) statsByGame.set(gid, []);
    statsByGame.get(gid)!.push(stat);
  }

  const result = new Map<number, { home: TopScorer | null; visitor: TopScorer | null }>();

  for (const game of games) {
    const stats = statsByGame.get(game.id) ?? [];
    const homeStats = stats.filter(s => s.team?.id === game.home_team.id);
    const visitorStats = stats.filter(s => s.team?.id === game.visitor_team.id);

    const topHome = [...homeStats].sort((a, b) => (b.pts ?? 0) - (a.pts ?? 0))[0];
    const topVisitor = [...visitorStats].sort((a, b) => (b.pts ?? 0) - (a.pts ?? 0))[0];

    result.set(game.id, {
      home: topHome?.pts > 0
        ? { player: `${topHome.player.first_name[0]}. ${topHome.player.last_name}`, pts: topHome.pts }
        : null,
      visitor: topVisitor?.pts > 0
        ? { player: `${topVisitor.player.first_name[0]}. ${topVisitor.player.last_name}`, pts: topVisitor.pts }
        : null,
    });
  }

  return result;
}

export async function getNBAGames(date?: string) {
  const d = date ?? new Date().toISOString().slice(0, 10);
  const { data } = await client.get(`/games?per_page=30&dates[]=${d}`);

  const games: any[] = data.data ?? [];

  const startedGames = games.filter(g => /final|Q[1-4]|Halftime|OT/i.test(g.status ?? ''));
  const topScorersMap = startedGames.length > 0 ? await fetchTopScorers(startedGames) : new Map();

  const enriched = games.map(g => ({
    ...g,
    topScorers: topScorersMap.get(g.id) ?? null,
  }));

  return { ...data, data: enriched };
}

export async function getNBAGameDetail(gameId: number) {
  const { data } = await client.get(`/games/${gameId}`);
  return data;
}

export async function getNBAStandings(season: number) {
  const { data } = await client.get('/standings', { params: { season } });
  return data;
}

export async function getNBATeams() {
  const { data } = await client.get('/teams', { params: { per_page: 30 } });
  return data;
}

export interface PlayoffSeries {
  id: string;
  round: number;
  roundLabel: string;
  conference: 'East' | 'West' | 'Finals';
  teamA: any;
  teamB: any;
  winsA: number;
  winsB: number;
  status: 'ongoing' | 'finished';
  winner: any | null;
}

export async function getNBAPlayoffSeries(season: number): Promise<PlayoffSeries[]> {
  const allGames: any[] = [];
  let cursor: number | null = null;

  for (let i = 0; i < 20; i++) {
    const params: Record<string, any> = {
      postseason: true,
      'seasons[]': season,
      per_page: 100,
    };
    if (cursor) params.cursor = cursor;

    const { data } = await client.get('/games', { params });
    allGames.push(...(data.data ?? []));
    if (!data.meta?.next_cursor) break;
    cursor = data.meta.next_cursor;
  }

  if (allGames.length === 0) return [];
  return buildSeries(allGames);
}

function buildSeries(games: any[]): PlayoffSeries[] {
  games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const seriesMap = new Map<string, any>();

  for (const game of games) {
    const idA = Math.min(game.home_team.id, game.visitor_team.id);
    const idB = Math.max(game.home_team.id, game.visitor_team.id);
    const key = `${idA}-${idB}`;

    if (!seriesMap.has(key)) {
      const teamA = game.home_team.id === idA ? game.home_team : game.visitor_team;
      const teamB = game.home_team.id === idB ? game.home_team : game.visitor_team;
      seriesMap.set(key, {
        id: key, teamA, teamB,
        winsA: 0, winsB: 0,
        firstGameDate: game.date,
      });
    }

    const s = seriesMap.get(key)!;

    if (/final/i.test(game.status ?? '')) {
      const homeWon = game.home_team_score > game.visitor_team_score;
      const homeIsA = game.home_team.id === idA;
      if (homeWon === homeIsA) s.winsA++;
      else s.winsB++;
    }
  }

  const seriesList = Array.from(seriesMap.values()).sort(
    (a, b) => new Date(a.firstGameDate).getTime() - new Date(b.firstGameDate).getTime(),
  );

  // Assign rounds: series starting within 4 days of each other = same round
  let round = 1;
  let refTime = new Date(seriesList[0].firstGameDate).getTime();
  const ROUND_GAP_MS = 4 * 24 * 60 * 60 * 1000;

  const ROUND_LABELS: Record<number, string> = {
    1: 'Premier tour',
    2: 'Demi-finales',
    3: 'Finales de conférence',
    4: 'Finales NBA',
  };

  return seriesList.map(s => {
    const t = new Date(s.firstGameDate).getTime();
    if (t - refTime > ROUND_GAP_MS) {
      round++;
      refTime = t;
    }

    const conf: PlayoffSeries['conference'] =
      s.teamA.conference === s.teamB.conference
        ? (s.teamA.conference as 'East' | 'West')
        : 'Finals';

    return {
      id: s.id,
      round,
      roundLabel: ROUND_LABELS[round] ?? `Tour ${round}`,
      conference: conf,
      teamA: s.teamA,
      teamB: s.teamB,
      winsA: s.winsA,
      winsB: s.winsB,
      status: s.winsA === 4 || s.winsB === 4 ? 'finished' : 'ongoing',
      winner: s.winsA === 4 ? s.teamA : s.winsB === 4 ? s.teamB : null,
    };
  });
}
