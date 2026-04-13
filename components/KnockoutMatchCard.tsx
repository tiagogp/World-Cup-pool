"use client";

import { WinnerSelector } from "@/components/WinnerSelector";
import type { KnockoutMatch } from "@/types/predictions";

type KnockoutMatchCardProps = {
  match: KnockoutMatch;
  onWinnerSelect?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
};

export function KnockoutMatchCard({ match, onWinnerSelect, readOnly }: KnockoutMatchCardProps) {
  const blocked = !match.homeTeamId || !match.awayTeamId;

  return (
    <article className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-3 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2px_8px,rgba(0,0,0,0.02)_0px_1px_3px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.125px] text-[#615d59]">
          {match.label}
        </p>
        {match.winnerTeamId ? (
          <span className="rounded-full bg-[#f2f9ff] px-2 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8]">
            definido
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        <WinnerSelector
          teamId={match.homeTeamId}
          selected={match.winnerTeamId === match.homeTeamId}
          disabled={readOnly || blocked}
          onSelect={() => match.homeTeamId && onWinnerSelect?.(match.id, match.homeTeamId)}
        />
        <WinnerSelector
          teamId={match.awayTeamId}
          selected={match.winnerTeamId === match.awayTeamId}
          disabled={readOnly || blocked}
          onSelect={() => match.awayTeamId && onWinnerSelect?.(match.id, match.awayTeamId)}
        />
      </div>
    </article>
  );
}
