import { groups, teams } from "@/data/world-cup";
import type {
  GroupPick,
  GroupQualifier,
  KnockoutMatch,
  KnockoutRound,
  KnockoutSource,
  PredictionState,
  Team
} from "@/types/predictions";

export const STORAGE_KEY = "world-cup-prediction-state";

export const teamById = new Map(teams.map((team) => [team.id, team]));

export function getTeam(teamId: string | null): Team | null {
  return teamId ? teamById.get(teamId) ?? null : null;
}

export function createEmptyGroupPicks(): Record<string, GroupPick> {
  return Object.fromEntries(
    groups.map((group) => [
      group.code,
      {
        groupCode: group.code,
        firstTeamId: null,
        secondTeamId: null
      }
    ])
  );
}

export function getInitialPredictionState(): PredictionState {
  return {
    groupPicks: createEmptyGroupPicks(),
    knockoutSelections: {},
    championTeamId: null
  };
}

export function getQualifiersByGroup(
  groupPicks: Record<string, GroupPick>
): Record<string, GroupQualifier[]> {
  return Object.fromEntries(
    groups.map((group) => {
      const pick = groupPicks[group.code];
      const qualifiers: GroupQualifier[] = [];

      if (pick?.firstTeamId) {
        qualifiers.push({ teamId: pick.firstTeamId, position: 1 });
      }

      if (pick?.secondTeamId) {
        qualifiers.push({ teamId: pick.secondTeamId, position: 2 });
      }

      return [group.code, qualifiers];
    })
  );
}

export function areGroupPredictionsComplete(groupPicks: Record<string, GroupPick>) {
  return groups.every((group) => {
    const pick = groupPicks[group.code];
    return Boolean(
      pick?.firstTeamId &&
        pick.secondTeamId &&
        pick.firstTeamId !== pick.secondTeamId
    );
  });
}

function getPickedTeamId(
  qualifiersByGroup: Record<string, GroupQualifier[]>,
  groupCode: string,
  position: 1 | 2
) {
  return (
    qualifiersByGroup[groupCode]?.find((qualifier) => qualifier.position === position)?.teamId ??
    null
  );
}

const roundOf24Sources: Array<{
  id: string;
  label: string;
  home: KnockoutSource;
  away: KnockoutSource;
}> = [
  { id: "r24-1", label: "Jogo 1", home: { type: "group", groupCode: "I", position: 1 }, away: { type: "group", groupCode: "A", position: 2 } },
  { id: "r24-2", label: "Jogo 2", home: { type: "group", groupCode: "J", position: 1 }, away: { type: "group", groupCode: "B", position: 2 } },
  { id: "r24-3", label: "Jogo 3", home: { type: "group", groupCode: "K", position: 1 }, away: { type: "group", groupCode: "C", position: 2 } },
  { id: "r24-4", label: "Jogo 4", home: { type: "group", groupCode: "L", position: 1 }, away: { type: "group", groupCode: "D", position: 2 } },
  { id: "r24-5", label: "Jogo 5", home: { type: "group", groupCode: "E", position: 2 }, away: { type: "group", groupCode: "F", position: 2 } },
  { id: "r24-6", label: "Jogo 6", home: { type: "group", groupCode: "G", position: 2 }, away: { type: "group", groupCode: "H", position: 2 } },
  { id: "r24-7", label: "Jogo 7", home: { type: "group", groupCode: "I", position: 2 }, away: { type: "group", groupCode: "J", position: 2 } },
  { id: "r24-8", label: "Jogo 8", home: { type: "group", groupCode: "K", position: 2 }, away: { type: "group", groupCode: "L", position: 2 } }
];

const derivedRoundSources: Array<{
  id: string;
  round: KnockoutRound;
  label: string;
  home: KnockoutSource;
  away: KnockoutSource;
}> = [
  { id: "r16-1", round: "roundOf16", label: "Oitavas 1", home: { type: "group", groupCode: "A", position: 1 }, away: { type: "winner", matchId: "r24-1" } },
  { id: "r16-2", round: "roundOf16", label: "Oitavas 2", home: { type: "group", groupCode: "B", position: 1 }, away: { type: "winner", matchId: "r24-2" } },
  { id: "r16-3", round: "roundOf16", label: "Oitavas 3", home: { type: "group", groupCode: "C", position: 1 }, away: { type: "winner", matchId: "r24-3" } },
  { id: "r16-4", round: "roundOf16", label: "Oitavas 4", home: { type: "group", groupCode: "D", position: 1 }, away: { type: "winner", matchId: "r24-4" } },
  { id: "r16-5", round: "roundOf16", label: "Oitavas 5", home: { type: "group", groupCode: "E", position: 1 }, away: { type: "winner", matchId: "r24-5" } },
  { id: "r16-6", round: "roundOf16", label: "Oitavas 6", home: { type: "group", groupCode: "F", position: 1 }, away: { type: "winner", matchId: "r24-6" } },
  { id: "r16-7", round: "roundOf16", label: "Oitavas 7", home: { type: "group", groupCode: "G", position: 1 }, away: { type: "winner", matchId: "r24-7" } },
  { id: "r16-8", round: "roundOf16", label: "Oitavas 8", home: { type: "group", groupCode: "H", position: 1 }, away: { type: "winner", matchId: "r24-8" } },
  { id: "qf-1", round: "quarterfinal", label: "Quartas 1", home: { type: "winner", matchId: "r16-1" }, away: { type: "winner", matchId: "r16-2" } },
  { id: "qf-2", round: "quarterfinal", label: "Quartas 2", home: { type: "winner", matchId: "r16-3" }, away: { type: "winner", matchId: "r16-4" } },
  { id: "qf-3", round: "quarterfinal", label: "Quartas 3", home: { type: "winner", matchId: "r16-5" }, away: { type: "winner", matchId: "r16-6" } },
  { id: "qf-4", round: "quarterfinal", label: "Quartas 4", home: { type: "winner", matchId: "r16-7" }, away: { type: "winner", matchId: "r16-8" } },
  { id: "sf-1", round: "semifinal", label: "Semifinal 1", home: { type: "winner", matchId: "qf-1" }, away: { type: "winner", matchId: "qf-2" } },
  { id: "sf-2", round: "semifinal", label: "Semifinal 2", home: { type: "winner", matchId: "qf-3" }, away: { type: "winner", matchId: "qf-4" } },
  { id: "third", round: "thirdPlace", label: "Disputa de 3º lugar", home: { type: "loser", matchId: "sf-1" }, away: { type: "loser", matchId: "sf-2" } },
  { id: "final", round: "final", label: "Final", home: { type: "winner", matchId: "sf-1" }, away: { type: "winner", matchId: "sf-2" } }
];

function resolveSource(
  source: KnockoutSource,
  qualifiersByGroup: Record<string, GroupQualifier[]>,
  matchById: Map<string, KnockoutMatch>
) {
  if (source.type === "group") {
    return getPickedTeamId(qualifiersByGroup, source.groupCode, source.position);
  }

  const sourceMatch = matchById.get(source.matchId);

  if (!sourceMatch || !sourceMatch.winnerTeamId) {
    return null;
  }

  if (source.type === "winner") {
    return sourceMatch.winnerTeamId;
  }

  const participants = [sourceMatch.homeTeamId, sourceMatch.awayTeamId].filter(Boolean);
  return participants.find((teamId) => teamId !== sourceMatch.winnerTeamId) ?? null;
}

export function generateRoundOf24FromGroups(
  qualifiersByGroup: Record<string, GroupQualifier[]>
): KnockoutMatch[] {
  return roundOf24Sources.map((match) => ({
    id: match.id,
    round: "roundOf24",
    label: match.label,
    homeTeamId: resolveSource(match.home, qualifiersByGroup, new Map()),
    awayTeamId: resolveSource(match.away, qualifiersByGroup, new Map()),
    winnerTeamId: null,
    source: {
      home: match.home,
      away: match.away
    }
  }));
}

export function advanceKnockoutWinners(
  qualifiersByGroup: Record<string, GroupQualifier[]>,
  knockoutSelections: Record<string, string>
): KnockoutMatch[] {
  const matches: KnockoutMatch[] = [];
  const matchById = new Map<string, KnockoutMatch>();

  const append = (match: KnockoutMatch) => {
    const selected = knockoutSelections[match.id];
    const validWinner =
      selected && [match.homeTeamId, match.awayTeamId].includes(selected) ? selected : null;
    const safeMatch = { ...match, winnerTeamId: validWinner };
    matches.push(safeMatch);
    matchById.set(safeMatch.id, safeMatch);
  };

  generateRoundOf24FromGroups(qualifiersByGroup).forEach((match) => append(match));

  derivedRoundSources.forEach((definition) => {
    append({
      id: definition.id,
      round: definition.round,
      label: definition.label,
      homeTeamId: resolveSource(definition.home, qualifiersByGroup, matchById),
      awayTeamId: resolveSource(definition.away, qualifiersByGroup, matchById),
      winnerTeamId: null,
      source: {
        home: definition.home,
        away: definition.away
      }
    });
  });

  return matches;
}

export function getChampionTeamId(matches: KnockoutMatch[]) {
  return matches.find((match) => match.id === "final")?.winnerTeamId ?? null;
}

export function serializePredictionState(state: PredictionState) {
  return encodeURIComponent(
    btoa(
      JSON.stringify({
        groupPicks: state.groupPicks,
        knockoutSelections: state.knockoutSelections
      })
    )
  );
}

export function deserializePredictionState(value: string | null): PredictionState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(atob(decodeURIComponent(value))) as Partial<PredictionState>;
    if (!parsed.groupPicks || !parsed.knockoutSelections) {
      return null;
    }

    const qualifiersByGroup = getQualifiersByGroup(parsed.groupPicks);
    const bracket = advanceKnockoutWinners(qualifiersByGroup, parsed.knockoutSelections);

    return {
      groupPicks: parsed.groupPicks,
      knockoutSelections: parsed.knockoutSelections,
      championTeamId: getChampionTeamId(bracket)
    };
  } catch {
    return null;
  }
}
