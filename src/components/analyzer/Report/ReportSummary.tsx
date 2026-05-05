import { Card } from "@/components/ui/Card";
import { ScoreCard, scoreToTone } from "@/components/ui/ScoreCard";
import { Tag } from "@/components/ui/Tag";
import { formatDate } from "@/lib/utils";
import type { BusinessAnalysis } from "@/lib/types";

const monetizationLabel: Record<string, string> = {
  subscription: "Abonnement",
  commission: "Commission",
  freemium: "Freemium",
  "usage-based": "Usage-based",
  "one-shot": "Paiement one-shot",
  "premium-tier": "Offre premium",
  service: "Service accompagné",
};

export function ReportSummary({ analysis }: { analysis: BusinessAnalysis }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card surface="paper" elevation="2" radius="xl" className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="neutral">
            Analyse · {formatDate(analysis.createdAt)}
          </Tag>
          <Tag tone={analysis.liveSearchUsed ? "info" : "neutral"}>
            {analysis.liveSearchUsed
              ? "Recherche web active"
              : "Pas de recherche live"}
          </Tag>
          <Tag tone="gold">
            Monétisation :{" "}
            {monetizationLabel[analysis.recommendedMonetization] ??
              analysis.recommendedMonetization}
          </Tag>
        </div>

        <div>
          <p className="label-uppercase text-muted">Idée analysée</p>
          <p className="mt-2 text-lg leading-relaxed text-ink">
            {analysis.idea}
          </p>
        </div>

        <div>
          <p className="label-uppercase text-muted">Résumé honnête</p>
          <p className="mt-2 text-base leading-relaxed text-ink">
            {analysis.summary}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="label-uppercase text-muted">Positionnement recommandé</p>
            <p className="mt-2 text-base leading-relaxed text-ink">
              <span className="font-serif-italic mr-1">— </span>
              {analysis.positioning}
            </p>
          </div>
          <div>
            <p className="label-uppercase text-muted">Marché</p>
            <p className="mt-2 text-base leading-relaxed text-ink">
              {analysis.market.segment} · {analysis.market.estimatedSize}
            </p>
          </div>
        </div>
      </Card>

      <ScoreCard
        label="Score de viabilité"
        value={analysis.viabilityScore}
        size="lg"
        tone={scoreToTone(analysis.viabilityScore)}
        description={
          analysis.verdict === "too-vague"
            ? "L'idée est trop floue pour un score fiable. Précise-la d'abord."
            : "Score calibré. À confronter à la réalité terrain dès cette semaine."
        }
      />
    </div>
  );
}
