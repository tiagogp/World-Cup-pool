"use client";

import { Trophy } from "lucide-react";
import { CountryFlag } from "@/components/CountryFlag";
import { KnockoutMatchCard } from "@/components/KnockoutMatchCard";
import { TeamLabel } from "@/components/TeamLabel";
import { getTeam } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { KnockoutMatch, KnockoutRound } from "@/types/predictions";

const roundLabels: Record<KnockoutRound, string> = {
  roundOf24: "Primeira rodada",
  roundOf16: "Oitavas",
  quarterfinal: "Quartas",
  semifinal: "Semifinais",
  thirdPlace: "3º lugar",
  final: "Final"
};

const rowStarts: Record<"roundOf24" | "roundOf16" | "quarterfinal" | "semifinal", string[]> = {
  roundOf24: ["lg:row-start-1", "lg:row-start-5", "lg:row-start-9", "lg:row-start-13"],
  roundOf16: ["lg:row-start-1", "lg:row-start-5", "lg:row-start-9", "lg:row-start-13"],
  quarterfinal: ["lg:row-start-3", "lg:row-start-11"],
  semifinal: ["lg:row-start-7"]
};

type KnockoutBracketProps = {
  matches: KnockoutMatch[];
  championTeamId: string | null;
  onWinnerSelect?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
};

type BracketSide = "left" | "right";
type SideRound = "roundOf24" | "roundOf16" | "quarterfinal" | "semifinal";

const leftRounds: SideRound[] = ["roundOf24", "roundOf16", "quarterfinal", "semifinal"];
const rightRounds: SideRound[] = ["semifinal", "quarterfinal", "roundOf16", "roundOf24"];

function sideMatches(matches: KnockoutMatch[], round: SideRound, side: BracketSide) {
  const roundMatches = matches.filter((match) => match.round === round);
  const splitAt = Math.ceil(roundMatches.length / 2);

  return side === "left" ? roundMatches.slice(0, splitAt) : roundMatches.slice(splitAt);
}

export function KnockoutBracket({
  matches,
  championTeamId,
  onWinnerSelect,
  readOnly
}: KnockoutBracketProps) {
  const finalMatch = matches.find((match) => match.round === "final");
  const thirdPlaceMatch = matches.find((match) => match.round === "thirdPlace");

  return (
    <div className="space-y-5 rounded-[40px] bg-[#e8ebe6] p-3 text-[#0e0f0c] sm:p-5">
      <div className="overflow-x-auto rounded-[30px] bg-white p-4 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]">
        <div className="grid min-w-0 gap-6 lg:min-w-[1780px] lg:grid-cols-[1fr_260px_1fr] lg:items-center">
          <BracketSide
            side="left"
            matches={matches}
            onWinnerSelect={onWinnerSelect}
            readOnly={readOnly}
          />

          <div className="grid gap-4 lg:self-center">
            <ChampionCenter championTeamId={championTeamId} />
            {finalMatch ? (
              <div className="rounded-[30px] bg-[#0e0f0c] p-3 text-white">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="wise-display text-[32px] leading-[0.85]">Final</h3>
                  <span className="rounded-full bg-[#9fe870] px-3 py-1 text-xs font-semibold text-[#163300]">
                    decisão
                  </span>
                </div>
                <ClassicMatch
                  match={finalMatch}
                  side="center"
                  readOnly={readOnly}
                  onWinnerSelect={onWinnerSelect}
                />
              </div>
            ) : null}
          </div>

          <BracketSide
            side="right"
            matches={matches}
            onWinnerSelect={onWinnerSelect}
            readOnly={readOnly}
          />
        </div>
      </div>

      {thirdPlaceMatch ? (
        <section className="rounded-[30px] bg-white p-3 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] lg:max-w-[380px]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="wise-display text-[32px] leading-[0.85]">
              {roundLabels.thirdPlace}
            </h3>
            <span className="rounded-full bg-[#e2f6d5] px-2 py-1 text-xs font-semibold tracking-[-0.108px] text-[#163300]">
              extra
            </span>
          </div>
          <KnockoutMatchCard
            match={thirdPlaceMatch}
            readOnly={readOnly}
            onWinnerSelect={onWinnerSelect}
          />
        </section>
      ) : null}
    </div>
  );
}

type BracketSideProps = {
  side: BracketSide;
  matches: KnockoutMatch[];
  onWinnerSelect?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
};

function BracketSide({ side, matches, onWinnerSelect, readOnly }: BracketSideProps) {
  const rounds = side === "left" ? leftRounds : rightRounds;

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {rounds.map((round) => {
        const roundMatches = sideMatches(matches, round, side);

        return (
          <section key={`${side}-${round}`} className="min-w-0">
            <div className={cn("mb-3 flex items-center gap-2", side === "right" && "lg:justify-end")}>
              <h3 className="wise-display text-[28px] leading-[0.85]">{roundLabels[round]}</h3>
              <span className="rounded-full bg-[#e2f6d5] px-2 py-1 text-xs font-semibold text-[#163300]">
                {roundMatches.length}
              </span>
            </div>
            <div className="space-y-3 lg:grid lg:h-[880px] lg:grid-rows-[repeat(16,minmax(0,1fr))] lg:gap-0 lg:space-y-0">
              {roundMatches.map((match, index) => (
                <div
                  key={match.id}
                  className={cn(
                    "relative min-w-0 lg:row-span-3",
                    rowStarts[round][index],
                    side === "left" &&
                      "after:absolute after:left-full after:top-1/2 after:hidden after:h-px after:w-4 after:bg-[rgba(14,15,12,0.22)] after:content-[''] lg:after:block",
                    side === "right" &&
                      "after:absolute after:right-full after:top-1/2 after:hidden after:h-px after:w-4 after:bg-[rgba(14,15,12,0.22)] after:content-[''] lg:after:block"
                  )}
                >
                  <ClassicMatch
                    match={match}
                    side={side}
                    readOnly={readOnly}
                    onWinnerSelect={onWinnerSelect}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

type ClassicMatchProps = {
  match: KnockoutMatch;
  side: BracketSide | "center";
  onWinnerSelect?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
};

function ClassicMatch({ match, side, onWinnerSelect, readOnly }: ClassicMatchProps) {
  const blocked = !match.homeTeamId || !match.awayTeamId;

  return (
    <article className="relative z-10 rounded-[24px] bg-white p-2 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]">
      <p
        className={cn(
          "mb-2 px-2 text-xs font-semibold tracking-[-0.108px] text-[#868685]",
          side === "right" && "lg:text-right"
        )}
      >
        {match.label}
      </p>
      <div className="grid gap-2">
        <TeamNode
          teamId={match.homeTeamId}
          selected={match.winnerTeamId === match.homeTeamId}
          disabled={readOnly || blocked}
          side={side}
          onSelect={() => match.homeTeamId && onWinnerSelect?.(match.id, match.homeTeamId)}
        />
        <TeamNode
          teamId={match.awayTeamId}
          selected={match.winnerTeamId === match.awayTeamId}
          disabled={readOnly || blocked}
          side={side}
          onSelect={() => match.awayTeamId && onWinnerSelect?.(match.id, match.awayTeamId)}
        />
      </div>
    </article>
  );
}

type TeamNodeProps = {
  teamId: string | null;
  selected: boolean;
  disabled?: boolean;
  side: BracketSide | "center";
  onSelect: () => void;
};

function TeamNode({ teamId, selected, disabled, side, onSelect }: TeamNodeProps) {
  const team = getTeam(teamId);
  const isRight = side === "right";

  return (
    <button
      type="button"
      disabled={disabled || !teamId}
      onClick={onSelect}
      className={cn(
        "grid min-h-12 w-full min-w-0 grid-cols-[40px_1fr] items-center gap-2 rounded-full px-2 py-1 text-left transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163300]",
        isRight && "lg:grid-cols-[1fr_40px]",
        selected ? "bg-[#9fe870] text-[#163300]" : "bg-[#e8ebe6] text-[#0e0f0c]",
        (disabled || !teamId) && "cursor-not-allowed opacity-65 hover:scale-100"
      )}
    >
      {!isRight ? <FlagBubble teamId={teamId} /> : null}
      <span className={cn("min-w-0", isRight && "lg:text-right")}>
        <span className="block truncate text-sm font-semibold tracking-[-0.108px]">
          {team?.name ?? "TBD"}
        </span>
        <span className="block text-xs font-semibold tracking-[-0.108px] text-current/55">
          {team?.shortName ?? "TBD"}
        </span>
      </span>
      {isRight ? <FlagBubble teamId={teamId} /> : null}
    </button>
  );
}

function FlagBubble({ teamId }: { teamId: string | null }) {
  const team = getTeam(teamId);

  return (
    <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]">
      <CountryFlag
        code={team?.flagCode ?? null}
        title={team?.name ?? "TBD"}
        className="h-full w-full rounded-full object-cover shadow-none"
      />
    </span>
  );
}

function ChampionCenter({ championTeamId }: { championTeamId: string | null }) {
  return (
    <div className="rounded-[40px] bg-[#e2f6d5] p-5 text-center text-[#163300]">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#9fe870]">
        <Trophy className="size-8" />
      </div>
      <p className="mt-4 text-sm font-semibold tracking-[-0.108px]">Campeão</p>
      <div className="mt-2 flex justify-center text-[18px] font-semibold tracking-[-0.108px]">
        {championTeamId ? <TeamLabel teamId={championTeamId} /> : "Aguardando final"}
      </div>
    </div>
  );
}
