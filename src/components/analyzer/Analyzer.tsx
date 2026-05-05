"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ApiError, BusinessAnalysis } from "@/lib/types";
import type { BusinessAnalysisCore } from "@/lib/ai/schemas";
import { IdeaInput } from "./IdeaInput";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { analysesStore } from "@/lib/storage/analyses";
import { buildAnalysisFromCore } from "@/lib/analysis/build";

type Phase = "idle" | "analyzing" | "error";

export function Analyzer() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [idea, setIdea] = React.useState("");
  const [error, setError] = React.useState<ApiError | null>(null);

  async function postJson<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { error?: ApiError }
        | null;
      throw (
        data?.error ?? {
          code: "network_error",
          message: `Erreur ${res.status}`,
        }
      );
    }
    return (await res.json()) as T;
  }

  async function handleStart() {
    if (idea.trim().length < 12) return;
    setError(null);
    setPhase("analyzing");
    try {
      const data = await postJson<{
        core: BusinessAnalysisCore;
        liveSearchUsed: boolean;
      }>("/api/analyze", { idea, clarifications: [] });
      const analysis: BusinessAnalysis = buildAnalysisFromCore({
        idea,
        clarifications: [],
        core: data.core,
        liveSearchUsed: data.liveSearchUsed,
      });
      analysesStore.save(analysis);
      router.push(`/analysis/${analysis.id}`);
    } catch (err) {
      setError(err as ApiError);
      setPhase("error");
    }
  }

  return (
    <div className="space-y-8">
      {phase === "idle" ? (
        <IdeaInput
          value={idea}
          onChange={setIdea}
          onSubmit={handleStart}
        />
      ) : null}

      {phase === "analyzing" ? (
        <LoadingState
          title="Analyse honnête en cours…"
          steps={[
            "Lecture critique de l'idée",
            "Cartographie marché et concurrence",
            "Calibrage des 7 risques",
            "ICP, monétisation, Business Model Canvas",
            "Plan MVP et plan de validation terrain",
            "Verdict Go / No-Go",
          ]}
        />
      ) : null}

      {phase === "error" && error ? (
        <ErrorState
          title="L'analyse n'a pas abouti"
          message={error.message}
          recoveryHint={error.recoveryHint}
          onRetry={() => handleStart()}
        />
      ) : null}
    </div>
  );
}
