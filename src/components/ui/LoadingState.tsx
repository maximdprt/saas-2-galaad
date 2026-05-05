"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  title?: string;
  steps?: string[];
  className?: string;
}

export function LoadingState({
  title = "Analyse en cours…",
  steps,
  className,
}: LoadingStateProps) {
  const defaultSteps = React.useMemo(
    () => [
      "Lecture honnête de l'idée",
      "Cartographie marché et concurrence",
      "Évaluation des 7 risques",
      "Plan MVP et plan de validation",
      "Rédaction du verdict Go/No-Go",
    ],
    [],
  );
  const list = steps ?? defaultSteps;
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 2400);
    return () => clearInterval(id);
  }, [list.length]);

  return (
    <div
      className={cn(
        "border border-sand bg-paper",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-sand px-6 py-4 sm:px-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-olive opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-olive" />
        </span>
        <p className="label-uppercase text-muted">En cours</p>
      </div>

      <div className="px-6 py-8 sm:px-8">
        <h3 className="text-2xl font-semibold leading-tight">{title}</h3>

        <ul className="mt-6 space-y-3">
          {list.map((step, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-4 text-sm leading-relaxed transition-colors",
                i === index
                  ? "text-ink"
                  : i < index
                    ? "text-muted"
                    : "text-muted-light",
              )}
            >
              <span
                className={cn(
                  "h-px w-4 shrink-0",
                  i === index ? "bg-olive" : "bg-sand",
                )}
              />
              {step}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <SkeletonBlock className="h-16" />
          <SkeletonBlock className="h-16" />
          <SkeletonBlock className="h-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer border border-sand",
        className,
      )}
    />
  );
}
