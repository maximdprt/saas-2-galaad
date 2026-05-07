"use client";

import * as React from "react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  recoveryHint?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Quelque chose a bloque",
  message,
  recoveryHint,
  onRetry,
  retryLabel = "Reessayer",
}: ErrorStateProps) {
  return (
    <div className="border border-coral/40 bg-coral/[0.06] p-6">
      <p className="label-uppercase text-coral">Erreur</p>
      <h3 className="mt-1 text-xl font-bold leading-tight">{title}</h3>
      {message ? (
        <p className="mt-2 text-sm leading-relaxed text-ink/80">{message}</p>
      ) : null}
      {recoveryHint ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {recoveryHint}
        </p>
      ) : null}
      {onRetry ? (
        <div className="mt-4">
          <Button onClick={onRetry} variant="secondary" size="sm">
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
