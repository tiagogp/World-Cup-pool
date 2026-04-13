import Link from "next/link";
import { Trophy } from "lucide-react";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Bolao</p>
            <p className="text-xs text-muted-foreground">World Cup Predictor</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
