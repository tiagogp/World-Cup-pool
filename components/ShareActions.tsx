"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, RotateCcw, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareActionsProps = {
  shareUrl: string;
  onShare: () => Promise<string>;
  onGenerateShareUrl: () => void;
  onReset: () => void;
};

export function ShareActions({
  shareUrl,
  onShare,
  onGenerateShareUrl,
  onReset
}: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const copyShareUrl = async () => {
    if (shareUrl && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    }
  };

  const sharePrediction = async () => {
    let url = "";

    try {
      url = await onShare();
      if (navigator.share) {
        await navigator.share({
          title: "Minha previsão da Copa 2026",
          text: "Veja meu caminho previsto para a Copa 2026.",
          url
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (url && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    }
  };

  return (
    <div className="rounded-[30px] bg-white p-4 shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px]">
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" onClick={sharePrediction}>
          <Share2 className="mr-2 size-4" />
          Compartilhar previsão
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
        <div className="mt-4 space-y-3 rounded-[20px] bg-[#e8ebe6] p-4">
          <p className="break-all text-sm font-semibold tracking-[-0.108px] text-[#454745]">{shareUrl}</p>
          {copied ? (
            <p className="text-sm font-semibold tracking-[-0.108px] text-[#054d28]">
              Link copiado.
            </p>
          ) : null}
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
