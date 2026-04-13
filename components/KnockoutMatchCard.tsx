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
    <article className="relative z-10 w-full min-w-0 max-w-full overflow-hidden rounded-[24px] bg-white p-3 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[-0.108px] text-[#868685]">
          {match.label}
        </p>
        {match.winnerTeamId ? (
          <span className="rounded-full bg-[#e2f6d5] px-2 py-1 text-xs font-semibold tracking-[-0.108px] text-[#163300]">
            definido
          </span>
        ) : null}
      </div>
      <div className="min-w-0 space-y-2">
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
