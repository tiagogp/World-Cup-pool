export type Team = {
  id: string;
  name: string;
  shortName: string;
  flagCode: string | null;
};

export type Group = {
  code: string;
  teamIds: string[];
};

export type GroupPick = {
  groupCode: string;
  firstTeamId: string | null;
  secondTeamId: string | null;
  thirdTeamId: string | null;
};

export type GroupQualifier = {
  teamId: string;
  position: 1 | 2 | 3;
};

export type KnockoutRound =
  | "roundOf32"
  | "roundOf16"
  | "quarterfinal"
  | "semifinal"
  | "thirdPlace"
  | "final";

export type KnockoutSource =
  | {
      type: "group";
      groupCode: string;
      position: 1 | 2 | 3;
    }
  | {
      type: "bestThird";
      allowedGroupCodes: string[];
    }
  | {
      type: "winner" | "loser";
      matchId: string;
    };

export type KnockoutMatch = {
  id: string;
  round: KnockoutRound;
  label: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  winnerTeamId: string | null;
  source: {
    home: KnockoutSource;
    away: KnockoutSource;
  };
};

export type PredictionState = {
  groupPicks: Record<string, GroupPick>;
  bestThirdGroupCodes: string[];
  knockoutSelections: Record<string, string>;
  championTeamId: string | null;
};
