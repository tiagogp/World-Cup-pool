"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { groups } from "@/data/world-cup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { StepProgress } from "@/components/StepProgress";
import { GroupCard } from "@/components/GroupCard";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { ReviewSummary } from "@/components/ReviewSummary";
import { ShareActions } from "@/components/ShareActions";
import {
  STORAGE_KEY,
  advanceKnockoutWinners,
  areGroupPredictionsComplete,
  deserializePredictionState,
  getChampionTeamId,
  getInitialPredictionState,
  getQualifiersByGroup,
  serializePredictionState
} from "@/lib/predictions";
import type { GroupPick, PredictionState } from "@/types/predictions";

function addTeamToGroupPick(pick: GroupPick, teamId: string): GroupPick {
  if (pick.firstTeamId === teamId || pick.secondTeamId === teamId) {
    return pick;
  }

  if (!pick.firstTeamId) {
    return { ...pick, firstTeamId: teamId };
  }

  if (!pick.secondTeamId) {
    return { ...pick, secondTeamId: teamId };
  }

  return pick;
}

function removeTeamFromGroupPick(pick: GroupPick, teamId: string): GroupPick {
  const remaining = [pick.firstTeamId, pick.secondTeamId].filter(
    (selectedTeamId): selectedTeamId is string =>
      Boolean(selectedTeamId) && selectedTeamId !== teamId
  );

  return {
    ...pick,
    firstTeamId: remaining[0] ?? null,
    secondTeamId: remaining[1] ?? null
  };
}

export default function PredictPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<PredictionState>(() => getInitialPredictionState());
  const [shareUrl, setShareUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const restored = deserializePredictionState(stored);
    if (restored) {
      setState(restored);
    }
  }, []);

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

  const savePrediction = () => {
    const nextState = { ...state, championTeamId };
    localStorage.setItem(STORAGE_KEY, serializePredictionState(nextState));
    setSaved(true);
  };

  const generateShareUrl = () => {
    const encoded = serializePredictionState({ ...state, championTeamId });
    const url = `${window.location.origin}/predict/share?p=${encoded}`;
    setShareUrl(url);
  };

  const resetAll = () => {
    const initial = getInitialPredictionState();
    setState(initial);
    setStep(0);
    setShareUrl("");
    setSaved(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <main className="min-h-screen">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-[#f2f9ff] px-3 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8]">
                Previsão da Copa
              </p>
              <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-0.8px] text-[rgba(0,0,0,0.95)] sm:text-[48px] sm:leading-none sm:tracking-[-1.5px]">
                Seu caminho até a taça
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-6 text-[#615d59]">
                Escolha dois classificados por grupo e depois avance o mata-mata até o campeão.
              </p>
            </div>
            {saved ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f2f9ff] px-3 py-2 text-sm font-semibold text-[#097fe8]">
                <CheckCircle2 className="size-4" />
                Salvo localmente
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
                <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
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
                  <h2 className="text-[22px] font-bold leading-tight tracking-[-0.25px]">Grupos primeiro</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
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
              onSave={savePrediction}
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
    </main>
  );
}
