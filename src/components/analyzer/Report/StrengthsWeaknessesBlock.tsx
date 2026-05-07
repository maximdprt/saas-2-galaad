import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import { toArr } from "@/lib/utils";
import type { BusinessAnalysis } from "@/lib/types";

export function StrengthsWeaknessesBlock({
  analysis,
}: {
  analysis: BusinessAnalysis;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Diagnostic"
        title={
          <>
            Forces, faiblesses et{" "}
            <span className="font-serif-italic text-olive">hypothèses critiques</span>
          </>
        }
        description="Pas de soft soap : ce qui tient et ce qui ne tient pas, à valider en priorité."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Forces</p>
          <ul className="space-y-1.5 text-sm">
            {toArr(analysis.strengths).map((s, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-fresh-green" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Faiblesses</p>
          <ul className="space-y-1.5 text-sm">
            {toArr(analysis.weaknesses).map((s, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-coral" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Hypothèses critiques</p>
          <ul className="space-y-1.5 text-sm">
            {toArr(analysis.assumptions).map((s, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-gold" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card surface="shell" elevation="flat" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Conseils actionnables</p>
          <ul className="space-y-1.5 text-sm">
            {toArr(analysis.advice).map((a, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-olive" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="shell" elevation="flat" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">
            Questions critiques à se poser
          </p>
          <ul className="space-y-1.5 text-sm">
            {toArr(analysis.criticalQuestions).map((q, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-vivid-blue" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
        <p className="label-uppercase text-muted">Canaux d'acquisition réalistes</p>
        <div className="flex flex-wrap gap-2">
          {toArr(analysis.acquisitionChannels).map((c, i) => (
            <span
              key={i}
              className="rounded-md border border-sand bg-shell px-3 py-1.5 text-sm text-ink"
            >
              {c}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
