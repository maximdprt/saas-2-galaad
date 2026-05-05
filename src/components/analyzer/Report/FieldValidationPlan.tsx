"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import type { FieldValidationPlan } from "@/lib/types";

export function FieldValidationPlanBlock({
  plan,
}: {
  plan: FieldValidationPlan;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Validation terrain"
        title={
          <>
            Valide l'idée{" "}
            <span className="font-serif-italic text-olive">sans coder</span>
          </>
        }
        description="Messages, scripts, métriques et seuils de décision concrets."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card surface="paper" elevation="1" radius="lg">
          <p className="label-uppercase mb-3 text-muted">Messages LinkedIn</p>
          <div className="space-y-3">
            {plan.linkedinMessages.map((m, i) => (
              <CopyBlock key={i} text={m} />
            ))}
          </div>
        </Card>

        <Card surface="paper" elevation="1" radius="lg">
          <p className="label-uppercase mb-3 text-muted">
            Questions d'interview client
          </p>
          <ul className="space-y-1.5 text-sm">
            {plan.interviewQuestions.map((q, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-vivid-blue" />
                {q}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Script découverte</p>
          <p className="text-sm leading-relaxed text-ink">
            {plan.discoveryScript}
          </p>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Landing test</p>
          <p className="text-sm leading-relaxed text-ink">{plan.landingTest}</p>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Concierge MVP</p>
          <p className="text-sm leading-relaxed text-ink">
            {plan.conciergeMVP}
          </p>
        </Card>
      </div>

      <Card surface="shell" elevation="flat" radius="lg" className="space-y-2">
        <p className="label-uppercase text-muted">Offre manuelle à vendre</p>
        <p className="text-base leading-relaxed text-ink">{plan.manualOffer}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Métriques à suivre</p>
          <ul className="space-y-1 text-sm">
            {plan.metrics.map((m, i) => (
              <li key={i}>· {m}</li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Signaux positifs</p>
          <ul className="space-y-1 text-sm">
            {plan.positiveSignals.map((m, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-fresh-green" />
                {m}
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Signaux négatifs</p>
          <ul className="space-y-1 text-sm">
            {plan.negativeSignals.map((m, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-coral" />
                {m}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card surface="paper" elevation="1" radius="lg">
        <p className="label-uppercase mb-3 text-muted">Seuils de décision</p>
        <ul className="space-y-2">
          {plan.thresholds.map((t, i) => {
            const tone =
              t.decision === "continue"
                ? "success"
                : t.decision === "pivot"
                  ? "gold"
                  : "danger";
            const label =
              t.decision === "continue"
                ? "Continuer"
                : t.decision === "pivot"
                  ? "Pivoter"
                  : "Arrêter";
            return (
              <li
                key={i}
                className="flex flex-wrap items-start gap-3 rounded-xl border border-sand p-3"
              >
                <Tag tone={tone}>{label}</Tag>
                <span className="text-sm leading-relaxed text-ink">
                  {t.criterion}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="rounded-xl border border-sand bg-shell p-3">
      <p className="text-sm leading-relaxed text-ink whitespace-pre-line">
        {text}
      </p>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
        className="mt-2 text-xs font-medium text-vivid-blue hover:underline"
      >
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}
