export interface FootballTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'AWARDED';

export interface MatchScore {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface FootballMatch {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday?: number;
  minute?: number;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  score: MatchScore;
  competition: {
    id: number;
    name: string;
    code: string;
    emblem?: string;
  };
}

export interface Standing {
  position: number;
  team: FootballTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

export interface StandingsGroup {
  stage: string;
  type: string;
  group?: string;
  table: Standing[];
}

export interface League {
  code: string;
  name: string;
  flag: string;
  id: number;
}
