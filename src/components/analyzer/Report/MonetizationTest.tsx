import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { MonetizationOption } from "@/lib/types";

const labels: Record<string, string> = {
  subscription: "Abonnement",
  commission: "Commission",
  freemium: "Freemium",
  "usage-based": "Usage-based",
  "one-shot": "Paiement one-shot",
  "premium-tier": "Offre premium",
  service: "Service accompagné",
};

const fitTone: Record<"low" | "medium" | "high", "danger" | "gold" | "success"> =
  {
    low: "danger",
    medium: "gold",
    high: "success",
  };

const complexityTone: Record<
  "low" | "medium" | "high",
  "success" | "gold" | "danger"
> = {
  low: "success",
  medium: "gold",
  high: "danger",
};

export function MonetizationTest({
  options,
  recommended,
}: {
  options: MonetizationOption[];
  recommended: string;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Monétisation"
        title={
          <>
            Modèles évalués —{" "}
            <span className="font-serif-italic text-olive">
              {labels[recommended] ?? recommended} recommandé pour démarrer
            </span>
          </>
        }
        description="Pour chaque modèle : avantages, inconvénients, complexité, compatibilité avec l'idée."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {options.map((opt) => (
          <Card
            key={opt.model}
            surface={opt.recommended ? "shell" : "paper"}
            elevation="1"
            radius="lg"
            bordered
            className={cn(
              "space-y-3",
              opt.recommended && "ring-2 ring-olive/20",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">
                {labels[opt.model] ?? opt.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {opt.recommended ? (
                  <Tag tone="success">Recommandé</Tag>
                ) : null}
                <Tag tone={fitTone[opt.fit]}>Fit {opt.fit}</Tag>
                <Tag tone={complexityTone[opt.complexity]}>
                  Complexité {opt.complexity}
                </Tag>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="label-uppercase mb-1.5 text-muted">Avantages</p>
                <ul className="space-y-1 text-sm">
                  {opt.pros.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 inline-block h-1 w-1 rounded-full bg-fresh-green" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label-uppercase mb-1.5 text-muted">
                  Inconvénients
                </p>
                <ul className="space-y-1 text-sm">
                  {opt.cons.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 inline-block h-1 w-1 rounded-full bg-coral" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="border-t border-sand pt-3 text-sm leading-relaxed text-ink">
              <span className="label-uppercase mr-2 text-muted">
                Justification
              </span>
              {opt.rationale}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
