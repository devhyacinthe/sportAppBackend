import { Router } from 'express';
import { withCache } from '../middleware/cache';
import {
  getLiveMatches,
  getTodayMatches,
  getCompetitionMatches,
  getMatchDetail,
  getStandings,
  LEAGUES,
} from '../services/footballApi';

const router = Router();

// List supported leagues
router.get('/leagues', (_req, res) => {
  res.json({ leagues: LEAGUES });
});

// Live matches (cache 45s)
router.get('/live', withCache(45), async (_req, res) => {
  try {
    const data = await getLiveMatches();
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

// Today's matches, optionally filtered by league
router.get('/today', withCache(60), async (req, res) => {
  try {
    const league = req.query.league as string | undefined;
    const data = await getTodayMatches(league);
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

// Matches for a competition (cache 2min for live, 10min otherwise)
router.get('/competitions/:code/matches', withCache(120), async (req, res) => {
  try {
    const matchday = req.query.matchday ? Number(req.query.matchday) : undefined;
    const data = await getCompetitionMatches(req.params.code, matchday);
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

// Standings (cache 5min)
router.get('/competitions/:code/standings', withCache(300), async (req, res) => {
  try {
    const data = await getStandings(req.params.code);
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

// Match detail (cache 30s)
router.get('/matches/:id', withCache(30), async (req, res) => {
  try {
    const data = await getMatchDetail(Number(req.params.id));
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
