"use client";

import { Button } from "@/components/ui/button";

type UnsavedChangesDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function UnsavedChangesDialog({
  onCancel,
  onConfirm
}: UnsavedChangesDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0e0f0c]/55 px-4">
      <div
        aria-modal="true"
        role="dialog"
        className="w-full max-w-md rounded-[30px] bg-white p-6 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]"
      >
        <h2 className="wise-display text-[40px] leading-[0.85] text-[#0e0f0c]">
          Sair do bolão?
        </h2>
        <p className="mt-4 text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
          Sua previsão ainda não foi compartilhada. Se sair agora, essas escolhas serão perdidas.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Continuar editando
          </Button>
          <Button type="button" onClick={onConfirm}>
            Sair mesmo assim
          </Button>
        </div>
      </div>
    </div>
  );
}
