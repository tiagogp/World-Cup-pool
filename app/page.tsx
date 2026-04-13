import Link from "next/link";
import { ArrowRight, ListChecks, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";

const flow = [
  {
    icon: ListChecks,
    title: "Pick each group's top two",
    text: "Choose 1st and 2nd place without entering every match."
  },
  {
    icon: Trophy,
    title: "Build the bracket",
    text: "Round of 16 slots are created from the group winners and runners-up."
  },
  {
    icon: Share2,
    title: "Save and share",
    text: "Keep progress locally or send a full read-only prediction link."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <PageHeader />
      <section className="pitch-grid mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">World Cup picks</p>
          <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-6xl">
            Build the tournament you think will happen.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Fill the group stage, let the knockout bracket form, choose every winner, and crown a champion.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/predict">
              Start predictions
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {flow.map((item) => (
            <Card key={item.title} className="bg-card/85">
              <CardContent className="p-5">
                <item.icon className="size-7 text-primary" />
                <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
