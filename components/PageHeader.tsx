import Link from "next/link";
import { Trophy } from "lucide-react";

export function PageHeader() {
  return (
    <header className="bg-white sticky top-0 z-30 border-b border-[#e8ebe6]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
            <Trophy className="size-5" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight tracking-[-0.108px] text-[#0e0f0c]">
              Bolão
            </p>
            <p className="text-xs font-semibold tracking-[-0.108px] text-[#868685]">
              Copa 2026
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
