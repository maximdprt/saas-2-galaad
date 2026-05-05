"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { analysesStore } from "@/lib/storage/analyses";
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
      {/* Header block — dark */}
      <div className="border border-soft-ink bg-ink px-6 py-8 sm:px-10 sm:py-10">
        <p className="label-uppercase text-coral">Mode Roast</p>
        <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.0] tracking-tight text-paper">
          On détruit ton idée.{" "}
          <span className="font-serif-italic font-normal text-coral">
            Pour de vrai.
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-light">
          Un associé VC qui a vu 3 000 pitches prend ton idée et cherche
          activement tout ce qui peut la tuer. Failles fatales, hypothèses
          fausses, concurrents dangereux, scénarios d&apos;échec. Sans filtre.
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
              ? "Roast en cours…"
              : analysis.destruction
                ? "Relancer le roast"
                : "Roaster mon idée"}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="border-x border-b border-soft-ink bg-ink/95 px-6 py-8 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
            </span>
            <p className="label-uppercase text-muted-light">En train de tout casser…</p>
          </div>
          <ul className="mt-6 space-y-3">
            {[
              "Cherche les hypothèses que tu refuses de voir",
              "Construit les objections d'investisseur qui font mal",
              "Imagine comment ça finit vraiment",
              "Rédige le verdict sans gants",
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-4 text-sm text-muted-light">
                <span className="h-px w-4 shrink-0 bg-soft-ink" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Error */}
      {error ? (
        <div className="border-x border-b border-soft-ink p-6 sm:p-8">
          <ErrorState
            title="Le roast a foiré"
            message={error.message}
            recoveryHint={error.recoveryHint}
            onRetry={run}
          />
        </div>
      ) : null}

      {/* Idle state */}
      {!loading && !analysis.destruction && !error ? (
        <div className="border-x border-b border-sand px-6 py-6 sm:px-10">
          <p className="text-sm text-muted">
            Lance le roast quand tu veux la vérité brutale — avant un pitch,
            avant de quitter ton job, avant d&apos;investir du temps.
          </p>
        </div>
      ) : null}

      {/* Results */}
      {!loading && analysis.destruction ? (
        <DestructionView destruction={analysis.destruction} />
      ) : null}
    </div>
  );
}

function DestructionView({ destruction }: { destruction: DestructionReport }) {
  return (
    <div>
      {/* Big verdict — dark banner */}
      <div className="border-x border-b border-soft-ink bg-ink px-6 py-10 sm:px-10 sm:py-14">
        <p className="label-uppercase text-coral">Le verdict</p>
        <blockquote className="mt-5 text-[clamp(1.25rem,3vw,2rem)] font-medium leading-[1.3] text-paper">
          <span className="font-serif-italic mr-2 text-coral opacity-60">&ldquo;</span>
          {destruction.honestVerdict}
          <span className="font-serif-italic ml-2 text-coral opacity-60">&rdquo;</span>
        </blockquote>
      </div>

      {/* Fatal flaws */}
      <RoastBlock
        label="Failles fatales"
        accent="coral"
        items={destruction.fatalFlaws}
        intro="Ce qui tue le projet structurellement :"
      />

      {/* Investor objections */}
      <RoastBlock
        label="Questions investisseur sans réponse"
        accent="danger"
        items={destruction.investorObjections}
        intro="Les questions posées en 30 secondes auxquelles tu n'as pas de bonne réponse :"
      />

      {/* Fragile assumptions — 2 col on desktop */}
      <div className="border-x border-b border-sand">
        <div className="border-b border-sand px-6 py-4 sm:px-8">
          <p className="label-uppercase text-muted">Hypothèses fragiles</p>
          <p className="mt-1 text-sm text-muted">Ce sur quoi tout repose et qui est probablement faux :</p>
        </div>
        <ul className="grid sm:grid-cols-2">
          {destruction.fragileAssumptions.map((item, i) => (
            <li
              key={i}
              className="border-b border-r border-sand p-6 text-sm leading-relaxed last:border-b-0 sm:even:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <span className="font-mono text-xs font-semibold text-gold">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-ink">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Dangerous competitors */}
      <RoastBlock
        label="Concurrents qui te mangent tout cru"
        accent="gold"
        items={destruction.dangerousCompetitors}
        intro="Les alternatives que tu sous-estimes dangereusement :"
      />

      {/* Failure scenarios */}
      <div className="border-x border-b border-soft-ink bg-ink">
        <div className="border-b border-soft-ink px-6 py-4 sm:px-8">
          <p className="label-uppercase text-coral">Scénarios d&apos;échec</p>
          <p className="mt-1 text-sm text-muted-light">Dans 18 mois, voilà comment ça se termine :</p>
        </div>
        <ul className="divide-y divide-soft-ink">
          {destruction.failureScenarios.map((item, i) => (
            <li key={i} className="flex gap-5 px-6 py-5 sm:px-8">
              <span className="mt-0.5 font-mono text-xs font-semibold text-coral shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-muted-light">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoastBlock({
  label,
  accent,
  items,
  intro,
}: {
  label: string;
  accent: "coral" | "danger" | "gold";
  items: string[];
  intro: string;
}) {
  const accentClass =
    accent === "coral"
      ? "text-coral"
      : accent === "danger"
        ? "text-danger"
        : "text-gold";
  const lineClass =
    accent === "coral"
      ? "bg-coral"
      : accent === "danger"
        ? "bg-danger"
        : "bg-gold";

  return (
    <div className="border-x border-b border-sand">
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
