import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-4 text-[18px] font-semibold tracking-[-0.108px] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163300] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100",
  {
    variants: {
      variant: {
        default: "bg-[#9fe870] text-[#163300]",
        secondary: "bg-[rgba(22,51,0,0.08)] text-[#0e0f0c]",
        outline: "bg-white text-[#0e0f0c] shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]",
        ghost: "bg-transparent text-[#0e0f0c]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-9 px-3",
        lg: "h-14 px-7 py-4 text-[20px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
