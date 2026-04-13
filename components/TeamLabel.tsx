import { getTeam } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import { CountryFlag } from "@/components/CountryFlag";

type TeamLabelProps = {
  teamId: string | null;
  muted?: boolean;
  strongCode?: boolean;
};

export function TeamLabel({ teamId, muted, strongCode }: TeamLabelProps) {
  const team = getTeam(teamId);

  if (!team) {
    return <span className="text-muted-foreground">TBD</span>;
  }

  return (
    <span className={cn("inline-flex w-full min-w-0 items-center gap-2", muted && "text-muted-foreground")}>
      <CountryFlag code={team.flagCode} title={team.name} />
      <span className="min-w-0 truncate">{team.name}</span>
      <span
        className={cn(
          "hidden shrink-0 text-xs sm:inline",
          strongCode ? "text-current/80" : "text-muted-foreground"
        )}
      >
        {team.shortName}
      </span>
    </span>
  );
}
