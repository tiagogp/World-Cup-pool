import Link from "next/link";
import { Trophy } from "lucide-react";

export function PageHeader() {
  return (
    <header className="border-b border-[rgba(0,0,0,0.1)] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded bg-[#0075de] text-white">
            <Trophy className="size-5" />
          </span>
          <div>
            <p className="text-[15px] font-bold leading-tight text-[rgba(0,0,0,0.95)]">Bolão</p>
            <p className="text-xs font-medium text-[#615d59]">Copa 2026</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
