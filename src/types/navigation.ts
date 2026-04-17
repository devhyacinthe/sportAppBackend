export type RootStackParamList = {
  Main: undefined;
  MatchDetail: { matchId: number; leagueCode: string };
  LeagueMatches: { leagueCode: string; leagueName: string; leagueFlag: string };
  Standings: { leagueCode: string; leagueName: string; leagueFlag: string };
  NBAGameDetail: { gameId: number };
};

export type BottomTabParamList = {
  Home: undefined;
  Football: undefined;
  NBA: undefined;
};
