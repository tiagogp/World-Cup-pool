"use client";

import Link from "next/link";
import { Copy, Save, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareActionsProps = {
  shareUrl: string;
  onSave: () => void;
  onGenerateShareUrl: () => void;
  onReset: () => void;
};

export function ShareActions({
  shareUrl,
  onSave,
  onGenerateShareUrl,
  onReset
}: ShareActionsProps) {
  const copyShareUrl = async () => {
    if (shareUrl && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2px_8px,rgba(0,0,0,0.02)_0px_1px_3px]">
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" onClick={onSave}>
          <Save className="mr-2 size-4" />
          Salvar previsão
        </Button>
        <Button type="button" variant="secondary" onClick={onGenerateShareUrl}>
          <Copy className="mr-2 size-4" />
          Gerar link
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 size-4" />
          Recomeçar
        </Button>
      </div>
      {shareUrl ? (
        <div className="mt-4 space-y-3 rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-3">
          <p className="break-all text-sm text-[#615d59]">{shareUrl}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={copyShareUrl}>
              Copiar link
            </Button>
            <Button asChild type="button">
              <Link href={shareUrl}>
                Abrir previsão
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
