import type { GroupPick } from "@/types/predictions";

export function addTeamToGroupPick(pick: GroupPick, teamId: string): GroupPick {
  if (
    pick.firstTeamId === teamId ||
    pick.secondTeamId === teamId ||
    pick.thirdTeamId === teamId
  ) {
    return pick;
  }

  if (!pick.firstTeamId) {
    return { ...pick, firstTeamId: teamId };
  }

  if (!pick.secondTeamId) {
    return { ...pick, secondTeamId: teamId };
  }

  if (!pick.thirdTeamId) {
    return { ...pick, thirdTeamId: teamId };
  }

  return pick;
}

export function removeTeamFromGroupPick(pick: GroupPick, teamId: string): GroupPick {
  const remaining = [pick.firstTeamId, pick.secondTeamId, pick.thirdTeamId].filter(
    (selectedTeamId): selectedTeamId is string =>
      Boolean(selectedTeamId) && selectedTeamId !== teamId
  );

  return {
    ...pick,
    firstTeamId: remaining[0] ?? null,
    secondTeamId: remaining[1] ?? null,
    thirdTeamId: remaining[2] ?? null
  };
}
