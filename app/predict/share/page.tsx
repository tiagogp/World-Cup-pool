"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageFooter } from "@/components/PageFooter";
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
        ? advanceKnockoutWinners(
            qualifiersByGroup,
            prediction.bestThirdGroupCodes,
            prediction.knockoutSelections
          )
        : [],
    [prediction, qualifiersByGroup]
  );

  const championTeamId = getChampionTeamId(bracket);

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="inline-flex rounded-full bg-[#e2f6d5] px-4 py-2 text-sm font-semibold tracking-[-0.108px] text-[#163300]">
            Previsão compartilhada
          </p>
          <h1 className="wise-display mt-4 text-[48px] leading-[0.85] text-[#0e0f0c] sm:text-[72px]">
            Caminho do torneio
          </h1>
          <p className="mt-4 max-w-2xl text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
            Esta previsão veio codificada diretamente no link.
          </p>
        </div>

        {prediction && qualifiersByGroup ? (
          <ReviewSummary
            groups={groups}
            groupPicks={prediction.groupPicks}
            bestThirdGroupCodes={prediction.bestThirdGroupCodes}
            bracket={bracket}
            championTeamId={championTeamId}
          />
        ) : (
          <Card>
            <CardContent className="p-6">
              <AlertTriangle className="size-8 text-[#d03238]" />
              <h2 className="wise-display mt-4 text-[40px] leading-[0.85]">Este link não tem uma previsão</h2>
              <p className="mt-3 text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
                Abra um link gerado pelo fluxo de compartilhamento ou comece uma nova previsão.
              </p>
              <Button asChild className="mt-5">
                <Link href="/predict">Começar previsão</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <PageFooter />
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white">
          <PageHeader />
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-6 text-sm text-[#3d3d3d]">
                Carregando previsão compartilhada...
              </CardContent>
            </Card>
          </div>
          <PageFooter />
        </main>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
