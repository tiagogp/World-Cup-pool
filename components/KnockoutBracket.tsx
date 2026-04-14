"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import { CountryFlag } from "@/components/CountryFlag";
import { KnockoutMatchCard } from "@/components/KnockoutMatchCard";
import { TeamLabel } from "@/components/TeamLabel";
import { getTeam } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { KnockoutMatch, KnockoutRound } from "@/types/predictions";

const roundLabels: Record<KnockoutRound, string> = {
  roundOf32: "Primeira rodada",
  roundOf16: "Oitavas",
  quarterfinal: "Quartas",
  semifinal: "Semifinais",
  thirdPlace: "3º lugar",
  final: "Final",
};

const rowStarts: Record<
  "roundOf32" | "roundOf16" | "quarterfinal" | "semifinal",
  string[]
> = {
  roundOf32: [
    "lg:row-start-1",
    "lg:row-start-5",
    "lg:row-start-9",
    "lg:row-start-13",
    "lg:row-start-17",
    "lg:row-start-21",
    "lg:row-start-25",
    "lg:row-start-29",
  ],
  roundOf16: [
    "lg:row-start-3",
    "lg:row-start-11",
    "lg:row-start-19",
    "lg:row-start-27",
  ],
  quarterfinal: ["lg:row-start-7", "lg:row-start-23"],
  semifinal: ["lg:row-start-15"],
};

type KnockoutBracketProps = {
  matches: KnockoutMatch[];
  championTeamId: string | null;
  onWinnerSelect?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
};

type BracketSide = "left" | "right";
type SideRound = "roundOf32" | "roundOf16" | "quarterfinal" | "semifinal";
type BracketPath = {
  id: string;
  d: string;
};

const leftRounds: SideRound[] = [
  "roundOf32",
  "roundOf16",
  "quarterfinal",
  "semifinal",
];
const rightRounds: SideRound[] = [
  "roundOf32",
  "roundOf16",
  "quarterfinal",
  "semifinal",
];

function sideMatches(
  matches: KnockoutMatch[],
  round: SideRound,
  side: BracketSide,
) {
  const roundMatches = matches.filter((match) => match.round === round);
  const splitAt = Math.ceil(roundMatches.length / 2);

  return side === "left"
    ? roundMatches.slice(0, splitAt)
    : roundMatches.slice(splitAt);
}

export function KnockoutBracket({
  matches,
  championTeamId,
  onWinnerSelect,
  readOnly,
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
              <div className="rounded-[30px] bg-white p-3 border">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="wise-display text-[32px] leading-[0.85]">
                    Final
                  </h3>
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

function BracketSide({
  side,
  matches,
  onWinnerSelect,
  readOnly,
}: BracketSideProps) {
  const rounds = side === "left" ? leftRounds : rightRounds;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const matchRefs = useRef(new Map<string, HTMLDivElement>());
  const [paths, setPaths] = useState<BracketPath[]>([]);

  const visibleMatchIds = useMemo(() => {
    const ids = new Set<string>();

    rounds.forEach((round) => {
      sideMatches(matches, round, side).forEach((match) => ids.add(match.id));
    });

    return ids;
  }, [matches, rounds, side]);

  const connections = useMemo(() => {
    return matches.flatMap((match) => {
      if (!visibleMatchIds.has(match.id)) {
        return [];
      }

      return [match.source.home, match.source.away].flatMap((source) => {
        if (source.type !== "winner" || !visibleMatchIds.has(source.matchId)) {
          return [];
        }

        return [
          {
            from: source.matchId,
            to: match.id,
          },
        ];
      });
    });
  }, [matches, visibleMatchIds]);

  const setMatchRef = useCallback(
    (matchId: string, element: HTMLDivElement | null) => {
      if (element) {
        matchRefs.current.set(matchId, element);
        return;
      }

      matchRefs.current.delete(matchId);
    },
    [],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const drawConnections = () => {
      const containerRect = container.getBoundingClientRect();

      setPaths(
        connections.flatMap((connection) => {
          const fromElement = matchRefs.current.get(connection.from);
          const toElement = matchRefs.current.get(connection.to);

          if (!fromElement || !toElement) {
            return [];
          }

          const fromRect = fromElement.getBoundingClientRect();
          const toRect = toElement.getBoundingClientRect();
          const fromX =
            side === "left"
              ? fromRect.right - containerRect.left
              : fromRect.left - containerRect.left;
          const toX =
            side === "left"
              ? toRect.left - containerRect.left
              : toRect.right - containerRect.left;
          const fromY = fromRect.top - containerRect.top + fromRect.height / 2;
          const toY = toRect.top - containerRect.top + toRect.height / 2;
          const midX = fromX + (toX - fromX) / 2;

          return [
            {
              id: `${connection.from}-${connection.to}`,
              d: `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`,
            },
          ];
        }),
      );
    };

    const animationFrame = window.requestAnimationFrame(drawConnections);
    const resizeObserver = new ResizeObserver(drawConnections);
    resizeObserver.observe(container);
    matchRefs.current.forEach((element) => resizeObserver.observe(element));
    window.addEventListener("resize", drawConnections);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", drawConnections);
    };
  }, [connections, matches, side]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid gap-4 lg:grid-cols-4",
        side === "right" && "lg:[direction:rtl]",
      )}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible lg:block"
      >
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            fill="none"
            className="stroke-border"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      {rounds.map((round) => {
        const roundMatches = sideMatches(matches, round, side);

        return (
          <section
            key={`${side}-${round}`}
            className="min-w-0 lg:[direction:ltr]"
          >
            <div
              className={cn(
                "mb-3 flex items-center gap-2",
                side === "right" && "lg:justify-end",
              )}
            >
              <h3 className="wise-display text-[28px] leading-[0.85]">
                {roundLabels[round]}
              </h3>
              <span className="rounded-full bg-[#e2f6d5] px-2 py-1 text-xs font-semibold text-[#163300]">
                {roundMatches.length}
              </span>
            </div>
            <div className="space-y-3 lg:grid lg:h-[1760px] lg:grid-rows-[repeat(32,minmax(0,1fr))] lg:gap-0 lg:space-y-0">
              {roundMatches.map((match, index) => (
                <div
                  key={match.id}
                  ref={(element) => setMatchRef(match.id, element)}
                  className={cn(
                    "relative z-10 min-w-0 lg:row-span-3",
                    rowStarts[round][index],
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

function ClassicMatch({
  match,
  side,
  onWinnerSelect,
  readOnly,
}: ClassicMatchProps) {
  const blocked = !match.homeTeamId || !match.awayTeamId;

  return (
    <article className="relative z-10 rounded-[24px] bg-white p-2 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]">
      <p
        className={cn(
          "mb-2 px-2 text-xs font-semibold tracking-[-0.108px] text-[#868685]",
          side === "right" && "lg:text-right",
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
          onSelect={() =>
            match.homeTeamId && onWinnerSelect?.(match.id, match.homeTeamId)
          }
        />
        <TeamNode
          teamId={match.awayTeamId}
          selected={match.winnerTeamId === match.awayTeamId}
          disabled={readOnly || blocked}
          side={side}
          onSelect={() =>
            match.awayTeamId && onWinnerSelect?.(match.id, match.awayTeamId)
          }
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

function TeamNode({
  teamId,
  selected,
  disabled,
  side,
  onSelect,
}: TeamNodeProps) {
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
        selected
          ? "bg-[#9fe870] text-[#163300]"
          : "bg-[#e8ebe6] text-[#0e0f0c]",
        (disabled || !teamId) &&
          "cursor-not-allowed opacity-65 hover:scale-100",
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
        {championTeamId ? (
          <TeamLabel teamId={championTeamId} />
        ) : (
          "Aguardando final"
        )}
      </div>
    </div>
  );
}
