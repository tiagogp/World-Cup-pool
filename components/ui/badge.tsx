import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#e2f6d5] px-3 py-1 text-xs font-semibold tracking-[-0.108px] text-[#163300]",
        className
      )}
      {...props}
    />
  );
}
