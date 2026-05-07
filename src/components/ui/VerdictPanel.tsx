import * as React from "react";
import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/types";

const verdictMeta: Record<
  Verdict,
  { label: string; tagline: string; surface: "ink" | "paper"; accent: string }
> = {
  go: {
    label: "GO — Tester vite",
    tagline: "Lance la validation terrain dès cette semaine.",
    surface: "ink",
    accent: "text-fresh-green",
  },
  "go-conditions": {
    label: "GO sous conditions",
    tagline: "À tester, mais seulement si les conditions ci-dessous sont vraies.",
    surface: "ink",
    accent: "text-gold",
  },
  pivot: {
    label: "Pivot recommandé",
    tagline: "L'idée ne tient pas en l'état. Garde le problème, change l'angle.",
    surface: "ink",
    accent: "text-coral",
  },
  "no-go": {
    label: "NO-GO pour l'instant",
    tagline: "Ne lance pas. Réécris ou abandonne.",
    surface: "ink",
    accent: "text-danger",
  },
  "too-vague": {
    label: "Trop flou pour conclure",
    tagline: "Précise l'idée avant de pouvoir trancher honnêtement.",
    surface: "paper",
    accent: "text-muted",
  },
};

interface VerdictPanelProps {
  verdict: Verdict;
  why: string;
  conditions?: string[];
  validateFirst?: string[];
  next48h?: string[];
  score?: number;
  className?: string;
}

export function VerdictPanel({
  verdict,
  why,
  conditions = [],
  validateFirst = [],
  next48h = [],
  score,
  className,
}: VerdictPanelProps) {
  const meta = verdictMeta[verdict];
  const isInk = meta.surface === "ink";

  return (
    <div
      className={cn(
        "rounded-lg border p-8 sm:p-10",
        isInk
          ? "border-soft-ink bg-ink text-paper shadow-[var(--shadow-level-3)]"
          : "border-sand bg-paper text-ink shadow-[var(--shadow-level-1)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <p
          className={cn(
            "label-uppercase",
            isInk ? "text-muted-light" : "text-muted",
          )}
        >
          Verdict
        </p>
        <h2
          className={cn(
            "text-3xl font-semibold leading-tight sm:text-4xl",
            meta.accent,
          )}
        >
          {meta.label}
        </h2>
        {typeof score === "number" ? (
          <span
            className={cn(
              "ml-auto text-sm",
              isInk ? "text-muted-light" : "text-muted",
            )}
          >
            Viabilité {Math.round(score)}/100
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-3 max-w-3xl text-lg leading-relaxed",
          isInk ? "text-paper/90" : "text-ink",
        )}
      >
        <span className="font-serif-italic mr-1">— </span>
        {meta.tagline}
      </p>

      <p
        className={cn(
          "mt-6 max-w-3xl text-base leading-relaxed",
          isInk ? "text-paper/85" : "text-ink",
        )}
      >
        {why}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {conditions.length > 0 ? (
          <VerdictList
            isInk={isInk}
            label="Conditions"
            items={conditions}
          />
        ) : null}
        {validateFirst.length > 0 ? (
          <VerdictList
            isInk={isInk}
            label="À valider d'abord"
            items={validateFirst}
          />
        ) : null}
        {next48h.length > 0 ? (
          <VerdictList
            isInk={isInk}
            label="Action 48h"
            items={next48h}
          />
        ) : null}
      </div>
    </div>
  );
}

function VerdictList({
  isInk,
  label,
  items,
}: {
  isInk: boolean;
  label: string;
  items: string[];
}) {
  return (
    <div>
      <p
        className={cn(
          "label-uppercase mb-3",
          isInk ? "text-muted-light" : "text-muted",
        )}
      >
        {label}
      </p>
      <ul className="space-y-2 text-sm leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span
              className={cn(
                "mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                isInk ? "bg-gold" : "bg-olive",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
