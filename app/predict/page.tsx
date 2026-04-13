"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { groups } from "@/data/world-cup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import { StepProgress } from "@/components/StepProgress";
import { GroupCard } from "@/components/GroupCard";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { ReviewSummary } from "@/components/ReviewSummary";
import { ShareActions } from "@/components/ShareActions";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { addTeamToGroupPick, removeTeamFromGroupPick } from "@/lib/group-picks";
import {
  advanceKnockoutWinners,
  areGroupPredictionsComplete,
  getChampionTeamId,
  getInitialPredictionState,
  getQualifiersByGroup,
  serializePredictionState
} from "@/lib/predictions";
import type { PredictionState } from "@/types/predictions";

export default function PredictPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<PredictionState>(() => getInitialPredictionState());
  const [shareUrl, setShareUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const interceptNavigation = (event: MouseEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");

      if (!link?.href) {
        return;
      }

      const nextUrl = new URL(link.href);
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const nextPath = `${nextUrl.pathname}${nextUrl.search}`;

      if (nextUrl.origin === window.location.origin && nextPath === currentPath) {
        return;
      }

      event.preventDefault();
      setPendingNavigationUrl(nextUrl.href);
    };

    document.addEventListener("click", interceptNavigation, true);
    return () => document.removeEventListener("click", interceptNavigation, true);
  }, [hasUnsavedChanges]);

  const markDirty = () => {
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  };

  const qualifiersByGroup = useMemo(
    () => getQualifiersByGroup(state.groupPicks),
    [state.groupPicks]
  );

  const groupStageComplete = areGroupPredictionsComplete(state.groupPicks);

  const bracket = useMemo(
    () =>
      groupStageComplete
        ? advanceKnockoutWinners(qualifiersByGroup, state.knockoutSelections)
        : [],
    [groupStageComplete, qualifiersByGroup, state.knockoutSelections]
  );

  const championTeamId = getChampionTeamId(bracket);
  const knockoutComplete = Boolean(championTeamId);

  const updateGroupPick = (groupCode: string, teamId: string) => {
    markDirty();
    setSaved(false);
    setShareUrl("");
    setState((current) => ({
      ...current,
      championTeamId: null,
      knockoutSelections: {},
      groupPicks: {
        ...current.groupPicks,
        [groupCode]: addTeamToGroupPick(current.groupPicks[groupCode], teamId)
      }
    }));
  };

  const removeGroupPick = (groupCode: string, teamId: string) => {
    markDirty();
    setSaved(false);
    setShareUrl("");
    setState((current) => ({
      ...current,
      championTeamId: null,
      knockoutSelections: {},
      groupPicks: {
        ...current.groupPicks,
        [groupCode]: removeTeamFromGroupPick(current.groupPicks[groupCode], teamId)
      }
    }));
  };

  const updateWinner = (matchId: string, teamId: string) => {
    markDirty();
    setSaved(false);
    setShareUrl("");
    setState((current) => ({
      ...current,
      knockoutSelections: {
        ...current.knockoutSelections,
        [matchId]: teamId
      },
      championTeamId: matchId === "final" ? teamId : current.championTeamId
    }));
  };

  const createShareUrl = () => {
    const nextState = { ...state, championTeamId };
    const encoded = serializePredictionState(nextState);
    const url = `${window.location.origin}/predict/share?p=${encoded}`;
    setShareUrl(url);
    setSaved(true);
    setHasUnsavedChanges(false);
    return url;
  };

  const sharePrediction = async () => {
    return createShareUrl();
  };

  const generateShareUrl = () => {
    createShareUrl();
  };

  const resetAll = () => {
    const initial = getInitialPredictionState();
    setState(initial);
    setStep(0);
    setShareUrl("");
    setSaved(false);
    setHasUnsavedChanges(false);
  };

  const leaveWithoutSaving = () => {
    if (!pendingNavigationUrl) {
      return;
    }

    setHasUnsavedChanges(false);
    setPendingNavigationUrl(null);
    const nextUrl = new URL(pendingNavigationUrl);
    if (nextUrl.origin === window.location.origin) {
      router.push(`${nextUrl.pathname}${nextUrl.search}`);
      return;
    }

    window.location.href = pendingNavigationUrl;
  };

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-[#e2f6d5] px-4 py-2 text-sm font-semibold tracking-[-0.108px] text-[#163300]">
                Previsão da Copa
              </p>
              <h1 className="wise-display mt-4 text-[48px] leading-[0.85] text-[#0e0f0c] sm:text-[72px]">
                Seu caminho até a taça
              </h1>
              <p className="mt-4 max-w-2xl text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
                Escolha dois classificados por grupo e depois avance o mata-mata até o campeão.
              </p>
            </div>
            {saved ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e2f6d5] px-4 py-2 text-sm font-semibold tracking-[-0.108px] text-[#163300]">
                <CheckCircle2 className="size-4" />
                Link pronto
              </div>
            ) : null}
          </div>
          <StepProgress
            currentStep={step}
            onStepChange={setStep}
            canOpenKnockout={groupStageComplete}
            canOpenReview={knockoutComplete}
          />
        </div>

        {step === 0 ? (
          <section className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {groups.map((group) => (
                <GroupCard
                  key={group.code}
                  group={group}
                  pick={state.groupPicks[group.code]}
                  onTeamToggle={updateGroupPick}
                  onTeamRemove={removeGroupPick}
                />
              ))}
            </div>
            <Card>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
                  {groupStageComplete
                    ? "Todos os classificados foram escolhidos. O mata-mata está pronto."
                    : "Escolha o 1º e o 2º colocado de todos os grupos para liberar o mata-mata."}
                </p>
                <Button
                  type="button"
                  disabled={!groupStageComplete}
                  onClick={() => setStep(1)}
                >
                  Abrir mata-mata
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="space-y-5">
            {groupStageComplete ? (
              <>
                <KnockoutBracket
                  matches={bracket}
                  championTeamId={championTeamId}
                  onWinnerSelect={updateWinner}
                />
                <Card>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
                      {knockoutComplete
                        ? "O campeão está definido. Revise sua previsão completa."
                        : "Escolha os vencedores até a final para completar o torneio."}
                    </p>
                    <Button
                      type="button"
                      disabled={!knockoutComplete}
                      onClick={() => setStep(2)}
                    >
                      Revisar previsão
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-5">
                  <h2 className="wise-display text-[40px] leading-[0.85]">Grupos primeiro</h2>
                  <p className="mt-3 text-[18px] font-semibold leading-7 tracking-[-0.108px] text-[#454745]">
                    Escolha os dois classificados de todos os grupos antes de abrir o chaveamento.
                  </p>
                  <Button className="mt-4" type="button" onClick={() => setStep(0)}>
                    Voltar para grupos
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-5">
            <ShareActions
              shareUrl={shareUrl}
              onShare={sharePrediction}
              onGenerateShareUrl={generateShareUrl}
              onReset={resetAll}
            />
            <ReviewSummary
              groups={groups}
              groupPicks={state.groupPicks}
              bracket={bracket}
              championTeamId={championTeamId}
            />
          </section>
        ) : null}
      </div>
      {pendingNavigationUrl ? (
        <UnsavedChangesDialog
          onCancel={() => setPendingNavigationUrl(null)}
          onConfirm={leaveWithoutSaving}
        />
      ) : null}
      <PageFooter />
    </main>
  );
}
