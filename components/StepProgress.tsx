import { cn } from "@/lib/utils";

const steps = ["Group Stage", "Knockout Stage", "Review"];

type StepProgressProps = {
  currentStep: number;
  onStepChange: (step: number) => void;
  canOpenKnockout: boolean;
  canOpenReview: boolean;
};

export function StepProgress({
  currentStep,
  onStepChange,
  canOpenKnockout,
  canOpenReview
}: StepProgressProps) {
  return (
    <nav className="grid grid-cols-3 gap-2">
      {steps.map((step, index) => {
        const locked = (index === 1 && !canOpenKnockout) || (index === 2 && !canOpenReview);
        return (
          <button
            key={step}
            type="button"
            disabled={locked}
            onClick={() => onStepChange(index)}
            className={cn(
              "rounded-md border px-3 py-3 text-left text-xs font-semibold transition sm:text-sm",
              currentStep === index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted",
              locked && "cursor-not-allowed opacity-45 hover:bg-card"
            )}
          >
            <span className="block text-[10px] uppercase tracking-[0.16em] opacity-75">
              Step {index + 1}
            </span>
            {step}
          </button>
        );
      })}
    </nav>
  );
}
