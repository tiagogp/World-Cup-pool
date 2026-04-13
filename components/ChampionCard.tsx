import { Trophy } from "lucide-react";
import { TeamLabel } from "@/components/TeamLabel";

type ChampionCardProps = {
  championTeamId: string | null;
};

export function ChampionCard({ championTeamId }: ChampionCardProps) {
  return (
    <section className="rounded-[40px] bg-[#0e0f0c] p-6 text-white">
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
          <Trophy className="size-6" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[-0.108px] text-[#9fe870]">
            Campeão previsto
          </p>
          <h2 className="wise-display mt-2 text-[40px] leading-[0.85]">
            {championTeamId ? <TeamLabel teamId={championTeamId} /> : "Aguardando a final"}
          </h2>
        </div>
      </div>
    </section>
  );
}
