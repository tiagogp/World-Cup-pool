import * as Flags from "country-flag-icons/react/3x2";
import type * as React from "react";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CountryFlagProps = {
  code: string | null;
  title: string;
  className?: string;
};

type FlagComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export function CountryFlag({ code, title, className }: CountryFlagProps) {
  const Flag = code ? (Flags as Record<string, FlagComponent>)[code] : null;

  if (!Flag) {
    return (
      <span
        aria-label={title}
        className={cn(
          "grid h-4 w-6 shrink-0 place-items-center rounded-[2px] bg-[#e8ebe6] text-[#454745]",
          className,
        )}
        role="img"
      >
        <Globe2 className="size-3" aria-hidden />
      </span>
    );
  }

  return (
    <Flag
      aria-label={title}
      role="img"
      className={cn(
        "h-4 w-6 shrink-0 rounded-[2px] object-cover shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]",
        className,
      )}
    />
  );
}
