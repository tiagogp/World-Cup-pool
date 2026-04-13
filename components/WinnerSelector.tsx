"use client";

import { Check } from "lucide-react";
import { TeamLabel } from "@/components/TeamLabel";
import { cn } from "@/lib/utils";

type WinnerSelectorProps = {
  teamId: string | null;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

export function WinnerSelector({ teamId, selected, disabled, onSelect }: WinnerSelectorProps) {
  return (
    <button
      type="button"
      disabled={disabled || !teamId}
      onClick={onSelect}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#097fe8] [&_.text-muted-foreground]:text-current/60",
        selected
          ? "bg-[#0075de] text-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2px_8px]"
          : "border border-[rgba(0,0,0,0.1)] bg-white text-[rgba(0,0,0,0.95)] hover:bg-[#f6f5f4]",
        (disabled || !teamId) &&
          "cursor-not-allowed border border-[rgba(0,0,0,0.08)] bg-[#f6f5f4] text-[#a39e98] opacity-100 hover:bg-[#f6f5f4]"
      )}
    >
      <TeamLabel teamId={teamId} />
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tracking-[0.125px]",
          selected ? "bg-white/18 text-white" : "bg-[#f2f9ff] text-[#097fe8]",
          (disabled || !teamId) && "bg-white text-[#a39e98]"
        )}
      >
        {selected ? <Check className="size-3" aria-hidden /> : null}
        {selected ? "Vencedor" : "Escolher"}
      </span>
    </button>
  );
}
