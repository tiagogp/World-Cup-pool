import Link from "next/link";
import { Github } from "lucide-react";

export function PageFooter() {
  return (
    <footer className="mt-12 bg-[#0e0f0c] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-[-0.108px]">
            Bolão da Copa 2026
          </p>
          <p className="mt-1 text-sm font-semibold tracking-[-0.108px] text-white/60">
            Feito para montar e compartilhar sua chave.
          </p>
        </div>
        <Link
          href="https://github.com/tiagogp"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#9fe870] px-5 py-3 text-[18px] font-semibold tracking-[-0.108px] text-[#163300] transition-transform hover:scale-105 active:scale-95"
        >
          <Github className="size-5" />
          Código no GitHub
        </Link>
      </div>
    </footer>
  );
}
