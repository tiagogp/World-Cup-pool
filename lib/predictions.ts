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
        secondTeamId: null,
        thirdTeamId: null
      }
    ])
  );
}

export function getInitialPredictionState(): PredictionState {
  return {
    groupPicks: createEmptyGroupPicks(),
    bestThirdGroupCodes: [],
    knockoutSelections: {},
    championTeamId: null
  };
}

function normalizeGroupPicks(groupPicks: Partial<Record<string, GroupPick>>) {
  const emptyGroupPicks = createEmptyGroupPicks();

  return Object.fromEntries(
    groups.map((group) => {
      const pick = groupPicks[group.code];
      const validTeamIds = new Set(group.teamIds);
      const firstTeamId =
        pick?.firstTeamId && validTeamIds.has(pick.firstTeamId) ? pick.firstTeamId : null;
      const secondTeamId =
        pick?.secondTeamId &&
        validTeamIds.has(pick.secondTeamId) &&
        pick.secondTeamId !== firstTeamId
          ? pick.secondTeamId
          : null;
      const thirdTeamId =
        pick?.thirdTeamId &&
        validTeamIds.has(pick.thirdTeamId) &&
        pick.thirdTeamId !== firstTeamId &&
        pick.thirdTeamId !== secondTeamId
          ? pick.thirdTeamId
          : null;

      return [
        group.code,
        {
          ...emptyGroupPicks[group.code],
          firstTeamId,
          secondTeamId,
          thirdTeamId
        }
      ];
    })
  ) as Record<string, GroupPick>;
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

      if (pick?.thirdTeamId) {
        qualifiers.push({ teamId: pick.thirdTeamId, position: 3 });
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
        pick.thirdTeamId &&
        pick.firstTeamId !== pick.secondTeamId &&
        pick.firstTeamId !== pick.thirdTeamId &&
        pick.secondTeamId !== pick.thirdTeamId
    );
  });
}

function getPickedTeamId(
  qualifiersByGroup: Record<string, GroupQualifier[]>,
  groupCode: string,
  position: 1 | 2 | 3
) {
  return (
    qualifiersByGroup[groupCode]?.find((qualifier) => qualifier.position === position)?.teamId ??
    null
  );
}

type ThirdSlotDefinition = {
  key: string;
  allowedGroupCodes: string[];
};

function computeThirdSlotAssignments(
  thirdSlots: ThirdSlotDefinition[],
  selectedThirdGroupCodes: string[]
): Map<string, string> {
  const wanted = new Set(selectedThirdGroupCodes);
  const slots = thirdSlots
    .map((slot) => ({
      ...slot,
      candidates: slot.allowedGroupCodes.filter((groupCode) => wanted.has(groupCode)).sort()
    }))
    .sort((a, b) => a.candidates.length - b.candidates.length || a.key.localeCompare(b.key));

  const assignment = new Map<string, string>();
  const used = new Set<string>();

  const dfs = (index: number): boolean => {
    if (index >= slots.length) {
      return used.size === wanted.size && assignment.size === slots.length;
    }

    const slot = slots[index];

    for (const groupCode of slot.candidates) {
      if (used.has(groupCode)) {
        continue;
      }

      used.add(groupCode);
      assignment.set(slot.key, groupCode);

      if (dfs(index + 1)) {
        return true;
      }

      used.delete(groupCode);
      assignment.delete(slot.key);
    }

    return false;
  };

  if (!dfs(0)) {
    return new Map();
  }

  return assignment;
}

const roundOf32Sources: Array<{
  id: string;
  label: string;
  home: KnockoutSource;
  away: KnockoutSource;
}> = [
  { id: "r32-1", label: "Jogo 1", home: { type: "group", groupCode: "E", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["A", "B", "C", "D", "F"] } },
  { id: "r32-2", label: "Jogo 2", home: { type: "group", groupCode: "I", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["C", "D", "F", "G", "H"] } },
  { id: "r32-3", label: "Jogo 3", home: { type: "group", groupCode: "A", position: 2 }, away: { type: "group", groupCode: "B", position: 2 } },
  { id: "r32-4", label: "Jogo 4", home: { type: "group", groupCode: "F", position: 1 }, away: { type: "group", groupCode: "C", position: 2 } },
  { id: "r32-5", label: "Jogo 5", home: { type: "group", groupCode: "K", position: 2 }, away: { type: "group", groupCode: "L", position: 2 } },
  { id: "r32-6", label: "Jogo 6", home: { type: "group", groupCode: "H", position: 1 }, away: { type: "group", groupCode: "J", position: 2 } },
  { id: "r32-7", label: "Jogo 7", home: { type: "group", groupCode: "D", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["B", "E", "F", "I", "J"] } },
  { id: "r32-8", label: "Jogo 8", home: { type: "group", groupCode: "G", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["A", "E", "H", "I", "J"] } },
  { id: "r32-9", label: "Jogo 9", home: { type: "group", groupCode: "C", position: 1 }, away: { type: "group", groupCode: "F", position: 2 } },
  { id: "r32-10", label: "Jogo 10", home: { type: "group", groupCode: "E", position: 2 }, away: { type: "group", groupCode: "I", position: 2 } },
  { id: "r32-11", label: "Jogo 11", home: { type: "group", groupCode: "A", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["C", "E", "F", "H", "I"] } },
  { id: "r32-12", label: "Jogo 12", home: { type: "group", groupCode: "L", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["E", "H", "I", "J", "K"] } },
  { id: "r32-13", label: "Jogo 13", home: { type: "group", groupCode: "J", position: 1 }, away: { type: "group", groupCode: "H", position: 2 } },
  { id: "r32-14", label: "Jogo 14", home: { type: "group", groupCode: "D", position: 2 }, away: { type: "group", groupCode: "G", position: 2 } },
  { id: "r32-15", label: "Jogo 15", home: { type: "group", groupCode: "B", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["E", "F", "G", "I", "J"] } },
  { id: "r32-16", label: "Jogo 16", home: { type: "group", groupCode: "K", position: 1 }, away: { type: "bestThird", allowedGroupCodes: ["D", "E", "I", "J", "L"] } }
];

const derivedRoundSources: Array<{
  id: string;
  round: KnockoutRound;
  label: string;
  home: KnockoutSource;
  away: KnockoutSource;
}> = [
  { id: "r16-1", round: "roundOf16", label: "Oitavas 1", home: { type: "winner", matchId: "r32-1" }, away: { type: "winner", matchId: "r32-2" } },
  { id: "r16-2", round: "roundOf16", label: "Oitavas 2", home: { type: "winner", matchId: "r32-3" }, away: { type: "winner", matchId: "r32-4" } },
  { id: "r16-3", round: "roundOf16", label: "Oitavas 3", home: { type: "winner", matchId: "r32-5" }, away: { type: "winner", matchId: "r32-6" } },
  { id: "r16-4", round: "roundOf16", label: "Oitavas 4", home: { type: "winner", matchId: "r32-7" }, away: { type: "winner", matchId: "r32-8" } },
  { id: "r16-5", round: "roundOf16", label: "Oitavas 5", home: { type: "winner", matchId: "r32-9" }, away: { type: "winner", matchId: "r32-10" } },
  { id: "r16-6", round: "roundOf16", label: "Oitavas 6", home: { type: "winner", matchId: "r32-11" }, away: { type: "winner", matchId: "r32-12" } },
  { id: "r16-7", round: "roundOf16", label: "Oitavas 7", home: { type: "winner", matchId: "r32-13" }, away: { type: "winner", matchId: "r32-14" } },
  { id: "r16-8", round: "roundOf16", label: "Oitavas 8", home: { type: "winner", matchId: "r32-15" }, away: { type: "winner", matchId: "r32-16" } },
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
  matchById: Map<string, KnockoutMatch>,
  thirdSlotAssignments: Map<string, string>,
  thirdSlotKey: string | null
) {
  if (source.type === "group") {
    return getPickedTeamId(qualifiersByGroup, source.groupCode, source.position);
  }

  if (source.type === "bestThird") {
    if (!thirdSlotKey) {
      return null;
    }

    const assignedGroup = thirdSlotAssignments.get(thirdSlotKey);
    return assignedGroup
      ? getPickedTeamId(qualifiersByGroup, assignedGroup, 3)
      : null;
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

export function generateRoundOf32FromGroups(
  qualifiersByGroup: Record<string, GroupQualifier[]>,
  bestThirdGroupCodes: string[]
): KnockoutMatch[] {
  const thirdSlots: ThirdSlotDefinition[] = roundOf32Sources.flatMap((match) => {
    const slots: ThirdSlotDefinition[] = [];
    if (match.home.type === "bestThird") {
      slots.push({ key: `${match.id}:home`, allowedGroupCodes: match.home.allowedGroupCodes });
    }
    if (match.away.type === "bestThird") {
      slots.push({ key: `${match.id}:away`, allowedGroupCodes: match.away.allowedGroupCodes });
    }
    return slots;
  });

  const thirdSlotAssignments = computeThirdSlotAssignments(thirdSlots, bestThirdGroupCodes);

  return roundOf32Sources.map((match) => ({
    id: match.id,
    round: "roundOf32",
    label: match.label,
    homeTeamId: resolveSource(
      match.home,
      qualifiersByGroup,
      new Map(),
      thirdSlotAssignments,
      match.home.type === "bestThird" ? `${match.id}:home` : null
    ),
    awayTeamId: resolveSource(
      match.away,
      qualifiersByGroup,
      new Map(),
      thirdSlotAssignments,
      match.away.type === "bestThird" ? `${match.id}:away` : null
    ),
    winnerTeamId: null,
    source: {
      home: match.home,
      away: match.away
    }
  }));
}

export function advanceKnockoutWinners(
  qualifiersByGroup: Record<string, GroupQualifier[]>,
  bestThirdGroupCodes: string[],
  knockoutSelections: Record<string, string>
): KnockoutMatch[] {
  const matches: KnockoutMatch[] = [];
  const matchById = new Map<string, KnockoutMatch>();
  const thirdSlots: ThirdSlotDefinition[] = roundOf32Sources.flatMap((match) => {
    const slots: ThirdSlotDefinition[] = [];
    if (match.home.type === "bestThird") {
      slots.push({ key: `${match.id}:home`, allowedGroupCodes: match.home.allowedGroupCodes });
    }
    if (match.away.type === "bestThird") {
      slots.push({ key: `${match.id}:away`, allowedGroupCodes: match.away.allowedGroupCodes });
    }
    return slots;
  });
  const thirdSlotAssignments = computeThirdSlotAssignments(thirdSlots, bestThirdGroupCodes);

  const append = (match: KnockoutMatch) => {
    const selected = knockoutSelections[match.id];
    const validWinner =
      selected && [match.homeTeamId, match.awayTeamId].includes(selected) ? selected : null;
    const safeMatch = { ...match, winnerTeamId: validWinner };
    matches.push(safeMatch);
    matchById.set(safeMatch.id, safeMatch);
  };

  roundOf32Sources.forEach((match) => {
    append({
      id: match.id,
      round: "roundOf32",
      label: match.label,
      homeTeamId: resolveSource(
        match.home,
        qualifiersByGroup,
        matchById,
        thirdSlotAssignments,
        match.home.type === "bestThird" ? `${match.id}:home` : null
      ),
      awayTeamId: resolveSource(
        match.away,
        qualifiersByGroup,
        matchById,
        thirdSlotAssignments,
        match.away.type === "bestThird" ? `${match.id}:away` : null
      ),
      winnerTeamId: null,
      source: {
        home: match.home,
        away: match.away
      }
    });
  });

  derivedRoundSources.forEach((definition) => {
    append({
      id: definition.id,
      round: definition.round,
      label: definition.label,
      homeTeamId: resolveSource(definition.home, qualifiersByGroup, matchById, thirdSlotAssignments, null),
      awayTeamId: resolveSource(definition.away, qualifiersByGroup, matchById, thirdSlotAssignments, null),
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

const groupPickChars = "0123x";
const knockoutPickChars = "012";
const knockoutMatchIds = [
  ...roundOf32Sources.map((match) => match.id),
  ...derivedRoundSources.map((match) => match.id)
];

function serializeCompactPredictionState(state: PredictionState) {
  const groupToken = groups
    .map((group) => {
      const pick = state.groupPicks[group.code];
      const firstIndex = pick?.firstTeamId ? group.teamIds.indexOf(pick.firstTeamId) : -1;
      const secondIndex = pick?.secondTeamId ? group.teamIds.indexOf(pick.secondTeamId) : -1;
      const thirdIndex = pick?.thirdTeamId ? group.teamIds.indexOf(pick.thirdTeamId) : -1;

      return `${groupPickChars[firstIndex >= 0 ? firstIndex : 4]}${
        groupPickChars[secondIndex >= 0 ? secondIndex : 4]
      }${groupPickChars[thirdIndex >= 0 ? thirdIndex : 4]}`;
    })
    .join("");

  const qualifiersByGroup = getQualifiersByGroup(state.groupPicks);
  const bestThirdToken = groups
    .map((group) => (state.bestThirdGroupCodes.includes(group.code) ? "1" : "0"))
    .join("");

  const bracket = advanceKnockoutWinners(
    qualifiersByGroup,
    state.bestThirdGroupCodes,
    state.knockoutSelections
  );
  const matchById = new Map(bracket.map((match) => [match.id, match]));

  const knockoutToken = knockoutMatchIds
    .map((matchId) => {
      const match = matchById.get(matchId);

      if (!match?.winnerTeamId) {
        return "0";
      }

      if (match.winnerTeamId === match.homeTeamId) {
        return "1";
      }

      if (match.winnerTeamId === match.awayTeamId) {
        return "2";
      }

      return "0";
    })
    .join("");

  return `v3-${groupToken}-${bestThirdToken}-${knockoutToken}`;
}

function deserializeCompactPredictionState(value: string): PredictionState | null {
  const [, groupToken, bestThirdToken, knockoutToken] = value.split("-");

  if (
    !groupToken ||
    !bestThirdToken ||
    !knockoutToken ||
    groupToken.length !== groups.length * 3 ||
    bestThirdToken.length !== groups.length
  ) {
    return null;
  }

  const groupPicks = createEmptyGroupPicks();

  groups.forEach((group, groupIndex) => {
    const firstChar = groupToken[groupIndex * 3];
    const secondChar = groupToken[groupIndex * 3 + 1];
    const thirdChar = groupToken[groupIndex * 3 + 2];
    const firstIndex = groupPickChars.indexOf(firstChar);
    const secondIndex = groupPickChars.indexOf(secondChar);
    const thirdIndex = groupPickChars.indexOf(thirdChar);
    const firstTeamId = firstIndex >= 0 && firstIndex < 4 ? group.teamIds[firstIndex] : null;
    const secondTeamId =
      secondIndex >= 0 && secondIndex < 4 && group.teamIds[secondIndex] !== firstTeamId
        ? group.teamIds[secondIndex]
        : null;
    const thirdTeamId =
      thirdIndex >= 0 &&
      thirdIndex < 4 &&
      group.teamIds[thirdIndex] !== firstTeamId &&
      group.teamIds[thirdIndex] !== secondTeamId
        ? group.teamIds[thirdIndex]
        : null;

    groupPicks[group.code] = {
      groupCode: group.code,
      firstTeamId,
      secondTeamId,
      thirdTeamId
    };
  });

  const bestThirdGroupCodes = groups
    .map((group, index) => (bestThirdToken[index] === "1" ? group.code : null))
    .filter((value): value is string => Boolean(value));

  const knockoutSelections: Record<string, string> = {};
  const qualifiersByGroup = getQualifiersByGroup(groupPicks);

  knockoutMatchIds.forEach((matchId, index) => {
    const pickChar = knockoutToken[index] ?? "0";

    if (!knockoutPickChars.includes(pickChar) || pickChar === "0") {
      return;
    }

    const bracket = advanceKnockoutWinners(qualifiersByGroup, bestThirdGroupCodes, knockoutSelections);
    const match = bracket.find((candidate) => candidate.id === matchId);
    const selectedTeamId = pickChar === "1" ? match?.homeTeamId : match?.awayTeamId;

    if (selectedTeamId) {
      knockoutSelections[matchId] = selectedTeamId;
    }
  });

  const bracket = advanceKnockoutWinners(qualifiersByGroup, bestThirdGroupCodes, knockoutSelections);

  return {
    groupPicks,
    bestThirdGroupCodes,
    knockoutSelections,
    championTeamId: getChampionTeamId(bracket)
  };
}

export function serializePredictionState(state: PredictionState) {
  return serializeCompactPredictionState(state);
}

export function deserializePredictionState(value: string | null): PredictionState | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("v2-")) {
    const v2 = deserializeLegacyV2CompactPredictionState(value);
    return v2;
  }

  if (value.startsWith("v3-")) {
    return deserializeCompactPredictionState(value);
  }

  try {
    const parsed = JSON.parse(atob(decodeURIComponent(value))) as Partial<PredictionState>;
    if (!parsed.groupPicks || !parsed.knockoutSelections) {
      return null;
    }

    const groupPicks = normalizeGroupPicks(parsed.groupPicks);
    const bestThirdGroupCodes = Array.isArray(parsed.bestThirdGroupCodes)
      ? parsed.bestThirdGroupCodes.filter((code): code is string => typeof code === "string")
      : [];
    const qualifiersByGroup = getQualifiersByGroup(groupPicks);
    const bracket = advanceKnockoutWinners(qualifiersByGroup, bestThirdGroupCodes, parsed.knockoutSelections);

    return {
      groupPicks,
      bestThirdGroupCodes,
      knockoutSelections: parsed.knockoutSelections,
      championTeamId: getChampionTeamId(bracket)
    };
  } catch {
    return null;
  }
}

function deserializeLegacyV2CompactPredictionState(value: string): PredictionState | null {
  const [, groupToken, knockoutToken] = value.split("-");

  if (!groupToken || !knockoutToken || groupToken.length !== groups.length * 2) {
    return null;
  }

  const groupPicks = createEmptyGroupPicks();

  groups.forEach((group, groupIndex) => {
    const firstChar = groupToken[groupIndex * 2];
    const secondChar = groupToken[groupIndex * 2 + 1];
    const firstIndex = groupPickChars.indexOf(firstChar);
    const secondIndex = groupPickChars.indexOf(secondChar);
    const firstTeamId = firstIndex >= 0 && firstIndex < 4 ? group.teamIds[firstIndex] : null;
    const secondTeamId =
      secondIndex >= 0 && secondIndex < 4 && group.teamIds[secondIndex] !== firstTeamId
        ? group.teamIds[secondIndex]
        : null;

    groupPicks[group.code] = {
      groupCode: group.code,
      firstTeamId,
      secondTeamId,
      thirdTeamId: null
    };
  });

  return {
    groupPicks,
    bestThirdGroupCodes: [],
    knockoutSelections: {},
    championTeamId: null
  };
}
