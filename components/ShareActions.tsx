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
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" onClick={onSave}>
          <Save className="mr-2 size-4" />
          Save prediction
        </Button>
        <Button type="button" variant="secondary" onClick={onGenerateShareUrl}>
          <Copy className="mr-2 size-4" />
          Generate share URL
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 size-4" />
          Reset all
        </Button>
      </div>
      {shareUrl ? (
        <div className="mt-4 space-y-3 rounded-md border border-border bg-background/70 p-3">
          <p className="break-all text-sm text-muted-foreground">{shareUrl}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={copyShareUrl}>
              Copy link
            </Button>
            <Button asChild type="button">
              <Link href={shareUrl}>
                Open shared prediction
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
