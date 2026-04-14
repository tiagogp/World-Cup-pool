import { cn } from "@/lib/utils";

const steps = ["Grupos", "Melhores 3º", "Mata-mata", "Revisão"];

type StepProgressProps = {
  currentStep: number;
  onStepChange: (step: number) => void;
  canOpenBestThird: boolean;
  canOpenKnockout: boolean;
  canOpenReview: boolean;
};

export function StepProgress({
  currentStep,
  onStepChange,
  canOpenBestThird,
  canOpenKnockout,
  canOpenReview
}: StepProgressProps) {
  return (
    <nav className="grid grid-cols-4 gap-1 rounded-[28px] bg-[#e8ebe6] p-1 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] sm:gap-2 sm:rounded-full">
      {steps.map((step, index) => {
        const locked =
          (index === 1 && !canOpenBestThird) ||
          (index === 2 && !canOpenKnockout) ||
          (index === 3 && !canOpenReview);
        return (
          <button
            key={step}
            type="button"
            disabled={locked}
            onClick={() => onStepChange(index)}
            className={cn(
              "min-w-0 rounded-[22px] px-2 py-3 text-left text-xs font-semibold tracking-[-0.108px] transition-transform hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163300] sm:rounded-full sm:px-3 sm:text-sm",
              currentStep === index
                ? "bg-[#9fe870] text-[#163300]"
                : "text-[#454745] hover:bg-white",
              locked && "cursor-not-allowed opacity-45 hover:scale-100 hover:bg-transparent"
            )}
          >
            <span className="block truncate text-[10px] opacity-70">
              Etapa {index + 1}
            </span>
            <span className="block truncate">{step}</span>
          </button>
        );
      })}
    </nav>
  );
}
