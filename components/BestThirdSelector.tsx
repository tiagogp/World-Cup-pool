"use client";

import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLabel } from "@/components/TeamLabel";
import { cn } from "@/lib/utils";
import type { Group, GroupPick } from "@/types/predictions";

type BestThirdSelectorProps = {
  groups: Group[];
  groupPicks: Record<string, GroupPick>;
  selectedGroupCodes: string[];
  onToggle: (groupCode: string) => void;
  readOnly?: boolean;
};

export function BestThirdSelector({
  groups,
  groupPicks,
  selectedGroupCodes,
  onToggle,
  readOnly
}: BestThirdSelectorProps) {
  const selectedSet = new Set(selectedGroupCodes);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Melhores terceiros</CardTitle>
        <p className="mt-1 text-sm font-semibold tracking-[-0.108px] text-[#868685]">
          Selecione 8 terceiros colocados para completar as 32 vagas do mata-mata.
        </p>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const pick = groupPicks[group.code];
          const thirdTeamId = pick?.thirdTeamId ?? null;
          const selected = selectedSet.has(group.code);
          const atLimit = !selected && selectedGroupCodes.length >= 8;
          const disabled = readOnly || !thirdTeamId || atLimit;

          return (
            <button
              key={group.code}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(group.code)}
              className={cn(
                "flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-[16px] font-semibold tracking-[-0.108px] transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163300] sm:px-4",
                selected
                  ? "bg-[#9fe870] text-[#163300]"
                  : "bg-white text-[#0e0f0c] shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] hover:bg-[#e2f6d5]",
                disabled &&
                  "cursor-not-allowed bg-[#e8ebe6] text-[#868685] opacity-70 hover:scale-100 hover:bg-[#e8ebe6]"
              )}
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[-0.108px] text-current/70">
                  Grupo {group.code} — 3º
                </p>
                <div className="mt-1 truncate text-sm font-semibold tracking-[-0.108px]">
                  <TeamLabel teamId={thirdTeamId} />
                </div>
              </div>

              {selected ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-[-0.108px]">
                  <Check className="size-4" aria-hidden />
                </span>
              ) : thirdTeamId ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-[-0.108px] text-[#454745]">
                  {atLimit ? (
                    <>
                      <X className="size-3" aria-hidden />
                      limite
                    </>
                  ) : (
                    "incluir"
                  )}
                </span>
              ) : (
                <span className="text-xs font-semibold">faltando 3º</span>
              )}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

