export interface NBATeam {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface NBATopScorer {
  player: string;
  pts: number;
}

export interface NBAGame {
  id: number;
  date: string;
  home_team: NBATeam;
  home_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string;
  visitor_team: NBATeam;
  visitor_team_score: number;
  topScorers?: {
    home: NBATopScorer | null;
    visitor: NBATopScorer | null;
  } | null;
}

export interface NBAStanding {
  team: NBATeam;
  conference: string;
  division: string;
  wins: number;
  losses: number;
  pct: number;
  games_back: string;
  home_record: string;
  road_record: string;
  points_per_game: number;
  opp_points_per_game: number;
}

export interface NBASeries {
  id: string;
  round: number;
  roundLabel: string;
  conference: 'East' | 'West' | 'Finals';
  teamA: NBATeam;
  teamB: NBATeam;
  winsA: number;
  winsB: number;
  status: 'ongoing' | 'finished';
  winner: NBATeam | null;
}
