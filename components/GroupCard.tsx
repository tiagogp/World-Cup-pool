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
  readOnly
}: GroupCardProps) {
  const completed = Boolean(pick.firstTeamId && pick.secondTeamId);
  const selectedTeamIds = [pick.firstTeamId, pick.secondTeamId].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Grupo {group.code}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Clique em dois times. A ordem define 1º e 2º.
            </p>
          </div>
          <Badge>{selectedTeamIds.length}/2</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {completed ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <SelectionPill label="1º" teamId={pick.firstTeamId} />
            <SelectionPill label="2º" teamId={pick.secondTeamId} />
          </div>
        ) : null}

        <div className="space-y-2">
          {group.teamIds.map((teamId) => {
            const selectedIndex = selectedTeamIds.indexOf(teamId);
            const selected = selectedIndex >= 0;
            const blocked = !selected && selectedTeamIds.length >= 2;

            return (
              <button
                key={teamId}
                type="button"
                disabled={readOnly || blocked}
                onClick={() =>
                  selected
                    ? onTeamRemove?.(group.code, teamId)
                    : onTeamToggle?.(group.code, teamId)
                }
                className={cn(
                  "flex min-h-12 w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm font-semibold transition",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background/70 hover:border-primary/70 hover:bg-muted",
                  blocked && "cursor-not-allowed opacity-40 hover:border-border hover:bg-background/70",
                  readOnly && "cursor-default hover:border-border hover:bg-background/70"
                )}
              >
                <TeamLabel teamId={teamId} />
                {selected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold">
                    {selectedIndex === 0 ? "1º" : "2º"}
                    {!readOnly ? <X className="size-3" aria-hidden /> : null}
                  </span>
                ) : blocked ? (
                  <span className="text-xs text-muted-foreground">Limite</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Selecionar</span>
                )}
              </button>
            );
          })}
        </div>
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
    <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{label}</p>
      <div className="mt-1 text-sm font-semibold">
        <TeamLabel teamId={teamId} />
      </div>
    </div>
  );
}
