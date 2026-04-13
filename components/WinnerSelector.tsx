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
        "flex min-h-11 w-full min-w-0 max-w-full items-center justify-between gap-2 overflow-hidden rounded-2xl px-3 py-2 text-left text-[16px] font-semibold tracking-[-0.108px] transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163300] [&_.text-muted-foreground]:text-current/60",
        selected
          ? "bg-[#9fe870] text-[#163300]"
          : "bg-white text-[#0e0f0c] shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] hover:bg-[#e2f6d5]",
        (disabled || !teamId) &&
          "cursor-not-allowed bg-[#e8ebe6] text-[#868685] opacity-70 hover:scale-100 hover:bg-[#e8ebe6]"
      )}
    >
      <span className="min-w-0 flex-1 overflow-hidden">
        <TeamLabel teamId={teamId} />
      </span>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tracking-[-0.108px]",
          selected ? "bg-[#163300] text-white" : "bg-[#e2f6d5] text-[#163300]",
          (disabled || !teamId) && "bg-white text-[#868685]"
        )}
      >
        {selected ? <Check className="size-3" aria-hidden /> : null}
        {selected ? "Vencedor" : "Escolher"}
      </span>
    </button>
  );
}
