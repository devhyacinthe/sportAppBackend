import { Router } from 'express';
import { withCache } from '../middleware/cache';
import {
  getNBAGames,
  getNBAGameDetail,
  getNBAStandings,
  getNBATeams,
  getNBAPlayoffSeries,
  currentSeason,
} from '../services/nbaApi';

const router = Router();

router.get('/games', withCache(60), async (req, res) => {
  try {
    const date = req.query.date as string | undefined;
    const data = await getNBAGames(date);
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/games/:id', withCache(30), async (req, res) => {
  try {
    const data = await getNBAGameDetail(Number(req.params.id));
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/standings', withCache(300), async (req, res) => {
  try {
    const season = req.query.season ? Number(req.query.season) : currentSeason();
    const data = await getNBAStandings(season);
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

// Playoff series (cache 10min — data doesn't change that fast)
router.get('/playoffs', withCache(600), async (req, res) => {
  try {
    const season = req.query.season ? Number(req.query.season) : currentSeason();
    const series = await getNBAPlayoffSeries(season);
    res.json({ data: series, season });
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/teams', withCache(86400), async (_req, res) => {
  try {
    const data = await getNBATeams();
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
