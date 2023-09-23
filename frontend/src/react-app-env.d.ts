/// <reference types="react-scripts" />

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.webm" {
  const src: string;
  export default src;
}

enum mapState {
  Con = 0,
  Home = 1,
  Away = 2,
}

type ScoreboardObject = {
  flip: boolean;
  score: ScoreObject;
  match: MatchInfoObject;
  mapState: mapState;
};

type ScoreObject = number[];

type CasterObject = {
  name: string;
  vdo?: string;
};

type CastersObject = CasterObject[];

type MatchInfoObject = {
  home: TeamObject;
  away: TeamObject;
  stats?: statsObject[];
};

type TeamObject = {
  id?: number;
  name: string;
  rank: Rank;
};

type Rank =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Diamond"
  | "Platinum"
  | "Master"
  | "Grand Master"
  | "Top 500";

type StatsObject = {
  points?: number;
  winLossDraw?: number[];
  mapDiff?: number;
};

type newTeam = {
  name: string;
  file?: File;
  target?: any;
};

type MapLookup = {
  control: {
    [key: string]: string;
  };
  escort: {
    [key: string]: string;
  };
  flashpoint: {
    [key: string]: string;
  };
  hybrid: {
    [key: string]: string;
  };
  push: {
    [key: string]: string;
  };
};

type ScoreBoardMapObject = {
  name: string;
  score: ScoreObject;
  isCompleted: boolean;
  isHomeAttacking?: boolean;
};

type ScoreBoardObjectBeta = {
  maps: ScoreBoardMapObject[];
  isFlipped: boolean;
};

type MatchObject = {
  id: string;
  home: TeamObject;
  away: TeamObject;
  scoreboard: ScoreBoardObjectBeta;
  leagueId?: string;
};

type MatchTemplate = {
  name: string;
  leagueId?: string;
  teams: string[];
  initialScoreboard: ScoreBoardObjectBeta[];
};
