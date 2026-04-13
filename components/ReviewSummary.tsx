import { GroupCard } from "@/components/GroupCard";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import type { Group, GroupPick, KnockoutMatch } from "@/types/predictions";

type ReviewSummaryProps = {
  groups: Group[];
  groupPicks: Record<string, GroupPick>;
  bracket: KnockoutMatch[];
  championTeamId: string | null;
};

export function ReviewSummary({
  groups,
  groupPicks,
  bracket,
  championTeamId
}: ReviewSummaryProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="text-[26px] font-bold leading-tight tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">
            Classificados por grupo
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#615d59]">
            Suas escolhas de 1º e 2º colocado em cada grupo.
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
          <h2 className="text-[26px] font-bold leading-tight tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">
            Caminho do mata-mata
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#615d59]">
            O bracket usa os classificados que você escolheu nos grupos.
          </p>
        </div>
        <KnockoutBracket matches={bracket} championTeamId={championTeamId} readOnly />
      </section>
    </div>
  );
}
