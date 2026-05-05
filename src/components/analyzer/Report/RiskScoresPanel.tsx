import { Card } from "@/components/ui/Card";
import { RiskTag } from "@/components/ui/RiskTag";
import { ScoreCard, riskScoreToTone } from "@/components/ui/ScoreCard";
import { SectionHeader } from "@/components/ui/Section";
import type { BusinessAnalysis, RiskKey } from "@/lib/types";

const order: RiskKey[] = [
  "market",
  "competition",
  "acquisition",
  "technical",
  "financial",
  "legal",
  "execution",
];

export function RiskScoresPanel({
  analysis,
}: {
  analysis: BusinessAnalysis;
}) {
  const sorted = [...analysis.riskScores].sort(
    (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Risques"
        title={
          <>
            7 risques calibrés —{" "}
            <span className="font-serif-italic text-olive">pas un score creux</span>
          </>
        }
        description="Chaque risque est noté de 0 à 100. Plus le score est élevé, plus le risque est réel et urgent à mitiger."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((r) => (
          <Card
            key={r.key}
            surface="paper"
            elevation="1"
            radius="lg"
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="label-uppercase text-muted">{r.label}</p>
              <RiskTag level={r.level} />
            </div>
            <ScoreCard
              label="Score"
              value={r.score}
              tone={riskScoreToTone(r.score)}
              size="sm"
              className="border-0 bg-transparent p-0 shadow-none"
            />
            <p className="text-sm leading-relaxed text-ink">
              <span className="label-uppercase mr-2 text-muted">Pourquoi</span>
              {r.why}
            </p>
            <p className="text-sm leading-relaxed text-ink">
              <span className="label-uppercase mr-2 text-muted">
                Comment réduire
              </span>
              {r.mitigation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
