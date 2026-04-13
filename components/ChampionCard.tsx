import { Trophy } from "lucide-react";
import { TeamLabel } from "@/components/TeamLabel";

type ChampionCardProps = {
  championTeamId: string | null;
};

export function ChampionCard({ championTeamId }: ChampionCardProps) {
  return (
    <section className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-5 text-[rgba(0,0,0,0.95)] shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2px_8px,rgba(0,0,0,0.02)_0px_1px_3px]">
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded bg-[#0075de] text-white">
          <Trophy className="size-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.125px] text-[#097fe8]">
            Campeão previsto
          </p>
          <h2 className="mt-1 text-[26px] font-bold leading-tight tracking-[-0.625px]">
            {championTeamId ? <TeamLabel teamId={championTeamId} /> : "Aguardando a final"}
          </h2>
        </div>
      </div>
    </section>
  );
}
