"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { VoiceButton } from "./VoiceButton";
import { cn } from "@/lib/utils";

const MAX_LEN = 4000;
const MIN_LEN = 12;

interface IdeaInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function IdeaInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
  className,
}: IdeaInputProps) {
  const remaining = MAX_LEN - value.length;
  const tooShort = value.trim().length < MIN_LEN;
  const tooLong = value.length > MAX_LEN;

  return (
    <form
      className={cn(
        "border border-sand bg-paper",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (tooShort || tooLong || loading || disabled) return;
        onSubmit();
      }}
    >
      <div className="border-b border-sand px-6 py-4 sm:px-8">
        <label className="label-uppercase text-muted" htmlFor="idea">
          Décris ton idée — sois concret
        </label>
      </div>
      <Textarea
        id="idea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        placeholder="Ex. Une plateforme SaaS pour aider les agences immobilières françaises à automatiser la relance des prospects via SMS et email, à 49€/mois par agence."
        className="w-full border-0 bg-transparent px-6 py-5 text-lg leading-relaxed shadow-none focus:ring-0 sm:px-8"
        maxLength={MAX_LEN + 200}
        disabled={loading || disabled}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <VoiceButton onTranscript={(t) => onChange(t)} />
          <span className="text-xs text-muted">
            {tooLong
              ? "Trop long, raccourcis."
              : value.length > 0
                ? `${Math.max(0, remaining)} caractères restants`
                : ""}
          </span>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={tooShort || tooLong || disabled}
        >
          {loading ? "Analyse en cours" : "Analyser l'idée"}
        </Button>
      </div>

      {tooShort && value.length > 0 ? (
        <p className="border-t border-sand px-6 py-3 text-xs text-muted sm:px-8">
          Ajoute quelques détails (cible, problème, contexte). 12 caractères minimum.
        </p>
      ) : null}
    </form>
  );
}
