import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#f2f9ff] px-2.5 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8]",
        className
      )}
      {...props}
    />
  );
}
