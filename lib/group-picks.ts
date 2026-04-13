import type { GroupPick } from "@/types/predictions";

export function addTeamToGroupPick(pick: GroupPick, teamId: string): GroupPick {
  if (pick.firstTeamId === teamId || pick.secondTeamId === teamId) {
    return pick;
  }

  if (!pick.firstTeamId) {
    return { ...pick, firstTeamId: teamId };
  }

  if (!pick.secondTeamId) {
    return { ...pick, secondTeamId: teamId };
  }

  return pick;
}

export function removeTeamFromGroupPick(pick: GroupPick, teamId: string): GroupPick {
  const remaining = [pick.firstTeamId, pick.secondTeamId].filter(
    (selectedTeamId): selectedTeamId is string =>
      Boolean(selectedTeamId) && selectedTeamId !== teamId
  );

  return {
    ...pick,
    firstTeamId: remaining[0] ?? null,
    secondTeamId: remaining[1] ?? null
  };
}
