"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLabel } from "@/components/TeamLabel";
import { cn } from "@/lib/utils";
import type { Group, GroupPick } from "@/types/predictions";

type GroupCardProps = {
  group: Group;
  pick: GroupPick;
  onTeamToggle?: (groupCode: string, teamId: string) => void;
  onTeamRemove?: (groupCode: string, teamId: string) => void;
  readOnly?: boolean;
};

export function GroupCard({
  group,
  pick,
  onTeamToggle,
  onTeamRemove,
  readOnly,
}: GroupCardProps) {
  const completed = Boolean(pick.firstTeamId && pick.secondTeamId);
  const selectedTeamIds = [pick.firstTeamId, pick.secondTeamId].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Grupo {group.code}</CardTitle>
            <p className="mt-1 text-sm font-semibold tracking-[-0.108px] text-[#868685]">
              Clique em dois times. A ordem define 1º e 2º.
            </p>
          </div>
          <Badge>{selectedTeamIds.length}/2</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {readOnly && completed ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <SelectionPill label="1º" teamId={pick.firstTeamId} />
            <SelectionPill label="2º" teamId={pick.secondTeamId} />
          </div>
        ) : null}
        {!readOnly ? (
          <div className="space-y-2">
            {group.teamIds.map((teamId) => {
              const selectedIndex = selectedTeamIds.indexOf(teamId);
              const selected = selectedIndex >= 0;
              const blocked = !selected && selectedTeamIds.length >= 2;

              return (
                <button
                  key={teamId}
                  type="button"
                  disabled={blocked}
                  onClick={() =>
                    selected
                      ? onTeamRemove?.(group.code, teamId)
                      : onTeamToggle?.(group.code, teamId)
                  }
                  className={cn(
                    "flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left text-[16px] font-semibold tracking-[-0.108px] transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163300] sm:gap-3 sm:px-4 sm:text-[18px] [&_.text-muted-foreground]:text-current/60",
                    selected
                      ? "bg-[#9fe870] text-[#163300]"
                      : "bg-white text-[#0e0f0c] shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] hover:bg-[#e2f6d5]",
                    blocked &&
                      "cursor-not-allowed bg-[#e8ebe6] text-[#868685] opacity-70 hover:scale-100 hover:bg-[#e8ebe6]",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    {selected ? (
                      <span className="shrink-0 gap-1 text-xs font-semibold tracking-[-0.108px]">
                        {selectedIndex === 0 ? "1º" : "2º"}
                      </span>
                    ) : null}
                    <TeamLabel teamId={teamId} strongCode={selected} />
                  </div>
                  {selected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-[-0.108px]">
                      <X className="size-3" aria-hidden />
                    </span>
                  ) : blocked ? (
                    <span className="text-xs font-semibold text-[#868685]">
                      Limite
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#454745]">
                      Selecionar
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

type SelectionPillProps = {
  label: string;
  teamId: string | null;
};

function SelectionPill({ label, teamId }: SelectionPillProps) {
  return (
    <div className="rounded-2xl bg-[#e2f6d5] px-4 py-3">
      <p className="text-xs font-semibold tracking-[-0.108px] text-[#163300]">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold tracking-[-0.108px]">
        <TeamLabel teamId={teamId} />
      </div>
    </div>
  );
}
