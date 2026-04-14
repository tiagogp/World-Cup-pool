import { GroupCard } from "@/components/GroupCard";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { Card, CardContent } from "@/components/ui/card";
import { TeamLabel } from "@/components/TeamLabel";
import type { Group, GroupPick, KnockoutMatch } from "@/types/predictions";

type ReviewSummaryProps = {
  groups: Group[];
  groupPicks: Record<string, GroupPick>;
  bestThirdGroupCodes: string[];
  bracket: KnockoutMatch[];
  championTeamId: string | null;
};

export function ReviewSummary({
  groups,
  groupPicks,
  bestThirdGroupCodes,
  bracket,
  championTeamId
}: ReviewSummaryProps) {
  const bestThirdTeams = bestThirdGroupCodes
    .slice()
    .sort()
    .map((groupCode) => ({
      groupCode,
      teamId: groupPicks[groupCode]?.thirdTeamId ?? null
    }))
    .filter((entry) => Boolean(entry.teamId));

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="wise-display text-[48px] leading-[0.85] text-[#0e0f0c]">
            Classificados por grupo
          </h2>
          <p className="mt-4 text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
            Suas escolhas de 1º, 2º e 3º colocado em cada grupo.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group) => (
            <GroupCard
              key={group.code}
              group={group}
              pick={groupPicks[group.code]}
              readOnly
            />
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="wise-display text-[48px] leading-[0.85] text-[#0e0f0c]">
            Melhores terceiros
          </h2>
          <p className="mt-4 text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
            Os 8 terceiros escolhidos para completar as 32 vagas.
          </p>
        </div>
        <Card>
          <CardContent className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {bestThirdTeams.map((entry) => (
              <div
                key={entry.groupCode}
                className="rounded-2xl bg-[#e2f6d5] px-4 py-3 text-[#163300]"
              >
                <p className="text-xs font-semibold tracking-[-0.108px]">
                  Grupo {entry.groupCode} — 3º
                </p>
                <div className="mt-1 text-sm font-semibold tracking-[-0.108px]">
                  <TeamLabel teamId={entry.teamId} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="wise-display text-[48px] leading-[0.85] text-[#0e0f0c]">
            Caminho do mata-mata
          </h2>
          <p className="mt-4 text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
            O bracket usa os classificados que você escolheu nos grupos.
          </p>
        </div>
        <KnockoutBracket matches={bracket} championTeamId={championTeamId} readOnly />
      </section>
    </div>
  );
}
