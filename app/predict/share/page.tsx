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
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Shared prediction
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Read-only tournament path</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This prediction was encoded directly in the URL.
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
              <AlertTriangle className="size-8 text-primary" />
              <h2 className="mt-4 text-xl font-bold">This link is missing a prediction</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Open a generated share URL or start a new bracket.
              </p>
              <Button asChild className="mt-5">
                <Link href="/predict">Start a prediction</Link>
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
                Loading shared prediction...
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
