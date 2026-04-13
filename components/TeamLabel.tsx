import { getTeam } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import { CountryFlag } from "@/components/CountryFlag";

type TeamLabelProps = {
  teamId: string | null;
  muted?: boolean;
};

export function TeamLabel({ teamId, muted }: TeamLabelProps) {
  const team = getTeam(teamId);

  if (!team) {
    return <span className="text-muted-foreground">TBD</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-2", muted && "text-muted-foreground")}>
      <CountryFlag code={team.flagCode} title={team.name} />
      <span>{team.name}</span>
      <span className="hidden text-xs text-muted-foreground sm:inline">{team.shortName}</span>
    </span>
  );
}
