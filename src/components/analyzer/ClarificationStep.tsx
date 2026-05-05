"use client";

import * as React from "react";
import type {
  ClarificationCheck,
  ClarificationAnswer,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Tag } from "@/components/ui/Tag";
import { Textarea, FieldLabel } from "@/components/ui/Field";

const categoryLabel: Record<string, string> = {
  target: "Cible",
  problem: "Problème",
  solution: "Solution",
  geo: "Géo",
  budget: "Budget",
  competition: "Concurrence",
  "business-model": "Modèle économique",
};

interface ClarificationStepProps {
  check: ClarificationCheck;
  onCancel: () => void;
  onSubmit: (answers: ClarificationAnswer[]) => void;
  loading?: boolean;
}

export function ClarificationStep({
  check,
  onCancel,
  onSubmit,
  loading,
}: ClarificationStepProps) {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const allAnswered = check.questions.every(
    (q) => (answers[q.id] ?? "").trim().length > 1,
  );

  return (
    <Card surface="paper" elevation="2" radius="xl" className="space-y-6">
      <div>
        <p className="label-uppercase text-muted">Avant l'analyse</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
          Ton idée mérite{" "}
          <span className="font-serif-italic text-olive">quelques précisions</span>
        </h3>
        {check.vaguenessReason ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {check.vaguenessReason}
          </p>
        ) : null}
      </div>

      <Callout tone="info" title="Pourquoi ces questions">
        Sans ces réponses, l'IA produirait un faux rapport rassurant. Réponds vite
        et honnêtement : 30 secondes par question suffisent.
      </Callout>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!allAnswered || loading) return;
          onSubmit(
            check.questions.map((q) => ({
              questionId: q.id,
              answer: answers[q.id] ?? "",
            })),
          );
        }}
      >
        {check.questions.map((q) => (
          <div key={q.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor={q.id}>{q.label}</FieldLabel>
              <Tag tone="neutral">
                {categoryLabel[q.category] ?? q.category}
              </Tag>
            </div>
            <Textarea
              id={q.id}
              rows={3}
              placeholder={q.hint ?? "Réponds en 1-3 phrases concrètes."}
              value={answers[q.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
            />
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            variant="ghost"
            withArrow={false}
            onClick={onCancel}
            type="button"
          >
            Modifier l'idée
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!allAnswered}
          >
            Lancer l'analyse honnête
          </Button>
        </div>
      </form>
    </Card>
  );
}
