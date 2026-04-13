"use client";

import { KnockoutMatchCard } from "@/components/KnockoutMatchCard";
import { ChampionCard } from "@/components/ChampionCard";
import type { KnockoutMatch, KnockoutRound } from "@/types/predictions";

const roundLabels: Record<KnockoutRound, string> = {
  roundOf24: "Round of 24",
  roundOf16: "Oitavas",
  quarterfinal: "Quartas",
  semifinal: "Semifinais",
  thirdPlace: "3º lugar",
  final: "Final"
};

const roundOrder: KnockoutRound[] = [
  "roundOf24",
  "roundOf16",
  "quarterfinal",
  "semifinal",
  "thirdPlace",
  "final"
];

type KnockoutBracketProps = {
  matches: KnockoutMatch[];
  championTeamId: string | null;
  onWinnerSelect?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
};

export function KnockoutBracket({
  matches,
  championTeamId,
  onWinnerSelect,
  readOnly
}: KnockoutBracketProps) {
  return (
    <div className="space-y-5 rounded-2xl bg-[#f6f5f4] p-3 text-[rgba(0,0,0,0.95)] sm:p-5">
      <ChampionCard championTeamId={championTeamId} />
      <div className="space-y-4 lg:overflow-x-auto lg:pb-2">
        <div className="grid gap-4 lg:grid-flow-col lg:auto-cols-[286px]">
          {roundOrder.map((round) => (
            <section
              key={round}
              className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white/60 p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[22px] font-bold leading-tight tracking-[-0.25px]">
                  {roundLabels[round]}
                </h3>
                <span className="rounded-full bg-[#f2f9ff] px-2 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8]">
                  {matches.filter((match) => match.round === round).length} jogos
                </span>
              </div>
              <div className="space-y-3">
                {matches
                  .filter((match) => match.round === round)
                  .map((match) => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      readOnly={readOnly}
                      onWinnerSelect={onWinnerSelect}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
