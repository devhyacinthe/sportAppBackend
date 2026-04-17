import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import footballRouter from './routes/football';
import nbaRouter from './routes/nba';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/football', footballRouter);
app.use('/api/nba', nbaRouter);

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`SportApp backend running on http://localhost:${PORT}`);
  });
}

export default app;
