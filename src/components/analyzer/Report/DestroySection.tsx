"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { analysesStore } from "@/lib/storage/analyses";
import { toArr } from "@/lib/utils";
import type {
  ApiError,
  BusinessAnalysis,
  DestructionReport,
} from "@/lib/types";

interface DestroySectionProps {
  analysis: BusinessAnalysis;
  onUpdate: (a: BusinessAnalysis) => void;
}

export function DestroySection({ analysis, onUpdate }: DestroySectionProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ApiError | null>(null);

  async function run() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/destroy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
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
      const destruction = (await res.json()) as DestructionReport;
      const next = analysesStore.update(analysis.id, { destruction });
      if (next) onUpdate(next);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="border border-sand bg-shell px-6 py-8 sm:px-10 sm:py-10">
        <p className="label-uppercase text-coral">Contre-analyse</p>
        <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-[1.0] tracking-normal text-ink">
          Cherche ce qui casse.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Noyau relit le rapport comme un associe exigeant : failles
          structurelles, hypotheses fragiles, objections investisseur,
          concurrents sous-estimes et scenarios d'echec.
        </p>
        <div className="mt-8">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={run}
            loading={loading}
          >
            {loading
              ? "Contre-analyse en cours"
              : analysis.destruction
                ? "Relancer la contre-analyse"
                : "Lancer la contre-analyse"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="border-x border-b border-sand bg-paper px-6 py-8 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
            </span>
            <p className="label-uppercase text-muted">Tri des failles</p>
          </div>
          <ul className="mt-6 space-y-3">
            {[
              "Isole les hypotheses non prouvees",
              "Formule les objections d'investisseur",
              "Cherche les concurrents sous-estimes",
              "Ecrit les scenarios d'echec probables",
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-4 text-sm text-muted">
                <span className="h-px w-4 shrink-0 bg-sand" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <div className="border-x border-b border-sand p-6 sm:p-8">
          <ErrorState
            title="La contre-analyse a echoue"
            message={error.message}
            recoveryHint={error.recoveryHint}
            onRetry={run}
          />
        </div>
      ) : null}

      {!loading && !analysis.destruction && !error ? (
        <div className="border-x border-b border-sand px-6 py-6 sm:px-10">
          <p className="text-sm text-muted">
            Lance cette lecture quand tu veux verifier les angles morts avant un
            pitch, un investissement ou une decision de pivot.
          </p>
        </div>
      ) : null}

      {!loading && analysis.destruction ? (
        <DestructionView destruction={analysis.destruction} />
      ) : null}
    </div>
  );
}

function DestructionView({ destruction }: { destruction: DestructionReport }) {
  return (
    <div>
      <div className="border-x border-b border-sand bg-ink px-6 py-10 sm:px-10">
        <p className="label-uppercase text-coral">Verdict de risque</p>
        <blockquote className="mt-5 text-[clamp(1.25rem,3vw,2rem)] font-medium leading-[1.3] text-shell">
          {destruction.honestVerdict}
        </blockquote>
      </div>

      <RiskBlock
        label="Failles structurelles"
        accent="coral"
        items={destruction.fatalFlaws}
        intro="Ce qui peut casser le projet en profondeur :"
      />

      <RiskBlock
        label="Questions investisseur"
        accent="danger"
        items={destruction.investorObjections}
        intro="Les questions auxquelles le projet doit repondre vite :"
      />

      <div className="border-x border-b border-sand bg-shell">
        <div className="border-b border-sand px-6 py-4 sm:px-8">
          <p className="label-uppercase text-muted">Hypotheses fragiles</p>
          <p className="mt-1 text-sm text-muted">
            Ce sur quoi tout repose et qui doit etre prouve :
          </p>
        </div>
        <ul className="grid sm:grid-cols-2">
          {toArr(destruction.fragileAssumptions).map((item, i) => (
            <li
              key={i}
              className="border-b border-r border-sand p-6 text-sm leading-relaxed last:border-b-0 sm:even:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <span className="font-mono text-xs font-semibold text-coral">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-ink">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      <RiskBlock
        label="Alternatives dangereuses"
        accent="blue"
        items={destruction.dangerousCompetitors}
        intro="Les concurrents ou habitudes existantes a ne pas sous-estimer :"
      />

      <RiskBlock
        label="Scenarios d'echec"
        accent="ink"
        items={destruction.failureScenarios}
        intro="Les trajectoires probables si rien n'est valide :"
      />
    </div>
  );
}

function RiskBlock({
  label,
  accent,
  items,
  intro,
}: {
  label: string;
  accent: "coral" | "danger" | "blue" | "ink";
  items: string[];
  intro: string;
}) {
  const accentClass =
    accent === "coral"
      ? "text-coral"
      : accent === "danger"
        ? "text-danger"
        : accent === "blue"
          ? "text-vivid-blue"
          : "text-ink";
  const lineClass =
    accent === "coral"
      ? "bg-coral"
      : accent === "danger"
        ? "bg-danger"
        : accent === "blue"
          ? "bg-vivid-blue"
          : "bg-ink";

  return (
    <div className="border-x border-b border-sand bg-shell">
      <div className="border-b border-sand px-6 py-4 sm:px-8">
        <p className={`label-uppercase ${accentClass}`}>{label}</p>
        <p className="mt-1 text-sm text-muted">{intro}</p>
      </div>
      <ul className="divide-y divide-sand">
        {items.map((item, i) => (
          <li key={i} className="flex gap-5 px-6 py-5 sm:px-8">
            <span className={`mt-2 h-px w-4 shrink-0 ${lineClass}`} />
            <p className="text-sm leading-relaxed text-ink">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
