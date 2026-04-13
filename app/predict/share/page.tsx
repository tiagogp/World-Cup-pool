"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { ReviewSummary } from "@/components/ReviewSummary";
import { groups } from "@/data/world-cup";
import {
  advanceKnockoutWinners,
  deserializePredictionState,
  getChampionTeamId,
  getQualifiersByGroup
} from "@/lib/predictions";

function SharePageContent() {
  const searchParams = useSearchParams();
  const prediction = useMemo(
    () => deserializePredictionState(searchParams.get("p")),
    [searchParams]
  );

  const qualifiersByGroup = useMemo(
    () => (prediction ? getQualifiersByGroup(prediction.groupPicks) : null),
    [prediction]
  );

  const bracket = useMemo(
    () =>
      prediction && qualifiersByGroup
        ? advanceKnockoutWinners(qualifiersByGroup, prediction.knockoutSelections)
        : [],
    [prediction, qualifiersByGroup]
  );

  const championTeamId = getChampionTeamId(bracket);

  return (
    <main className="min-h-screen">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="inline-flex rounded-full bg-[#f2f9ff] px-3 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8]">
            Previsão compartilhada
          </p>
          <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-0.8px] text-[rgba(0,0,0,0.95)] sm:text-[48px] sm:leading-none sm:tracking-[-1.5px]">
            Caminho do torneio
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-[#615d59]">
            Esta previsão veio codificada diretamente no link.
          </p>
        </div>

        {prediction && qualifiersByGroup ? (
          <ReviewSummary
            groups={groups}
            groupPicks={prediction.groupPicks}
            bracket={bracket}
            championTeamId={championTeamId}
          />
        ) : (
          <Card>
            <CardContent className="p-6">
              <AlertTriangle className="size-8 text-[#0075de]" />
              <h2 className="mt-4 text-xl font-bold">Este link não tem uma previsão</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Abra um link gerado pelo fluxo de compartilhamento ou comece uma nova previsão.
              </p>
              <Button asChild className="mt-5">
                <Link href="/predict">Começar previsão</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <PageHeader />
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Carregando previsão compartilhada...
              </CardContent>
            </Card>
          </div>
        </main>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
