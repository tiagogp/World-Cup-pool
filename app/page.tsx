import Link from "next/link";
import { ArrowRight, ListChecks, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";

const flow = [
  {
    icon: ListChecks,
    title: "Escolha os classificados",
    text: "Clique nos dois times que passam em cada grupo, na ordem de classificação."
  },
  {
    icon: Trophy,
    title: "Monte o mata-mata",
    text: "O chaveamento nasce automaticamente a partir das suas escolhas."
  },
  {
    icon: Share2,
    title: "Salve e compartilhe",
    text: "Guarde no navegador ou envie um link com a previsão completa."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <PageHeader />
      <section className="pitch-grid mx-auto flex min-h-[calc(100vh-69px)] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full bg-[#f2f9ff] px-3 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8]">
            Copa do Mundo 2026
          </p>
          <h1 className="mt-5 max-w-4xl text-[40px] font-bold leading-[1.04] tracking-[-1.2px] text-[rgba(0,0,0,0.95)] sm:text-[64px] sm:leading-none sm:tracking-[-2.125px]">
            Monte o caminho da Copa que você acredita.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-7 text-[#615d59] sm:text-xl">
            Escolha quem passa dos grupos, avance rodada por rodada e veja o campeão previsto no fim.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/predict">
              Começar previsão
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {flow.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <item.icon className="size-7 text-[#0075de]" />
                <h2 className="mt-4 text-[22px] font-bold leading-tight tracking-[-0.25px]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#615d59]">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
