import { cn } from "@/lib/utils";

const steps = ["Grupos", "Mata-mata", "Revisão"];

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
    <nav className="grid grid-cols-3 gap-2 rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-1">
      {steps.map((step, index) => {
        const locked = (index === 1 && !canOpenKnockout) || (index === 2 && !canOpenReview);
        return (
          <button
            key={step}
            type="button"
            disabled={locked}
            onClick={() => onStepChange(index)}
            className={cn(
              "rounded px-3 py-3 text-left text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#097fe8] sm:text-sm",
              currentStep === index
                ? "bg-white text-[rgba(0,0,0,0.95)] shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2px_8px]"
                : "text-[#615d59] hover:bg-white/70",
              locked && "cursor-not-allowed opacity-45 hover:bg-transparent"
            )}
          >
            <span className="block text-[10px] uppercase tracking-[0.125px] opacity-75">
              Etapa {index + 1}
            </span>
            {step}
          </button>
        );
      })}
    </nav>
  );
}
