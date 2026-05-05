import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import type { PricingBenchmark } from "@/lib/types";

export function PricingBenchmarkBlock({
  pricing,
}: {
  pricing: PricingBenchmark;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Pricing"
        title={
          <>
            Combien faire payer —{" "}
            <span className="font-serif-italic text-olive">et pourquoi</span>
          </>
        }
        description="Fourchette réaliste, prix de lancement, pricing MVP puis avancé. Justifications ouvertes."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PriceTile label="Fourchette réaliste" value={pricing.realisticRange} />
        <PriceTile label="Prix de lancement" value={pricing.launchPrice} highlight />
        <PriceTile label="Pricing MVP" value={pricing.mvpPricing} />
        <PriceTile label="Pricing avancé" value={pricing.advancedPricing} />
      </div>

      <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
        <p className="label-uppercase text-muted">Justification</p>
        <p className="text-base leading-relaxed text-ink">
          {pricing.justification}
        </p>
      </Card>

      {pricing.competitorPricing.length > 0 ? (
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Benchmark concurrents</p>
          <ul className="divide-y divide-sand">
            {pricing.competitorPricing.map((c, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm font-medium text-ink">{c.name}</span>
                <span className="text-sm tabular-nums">{c.price}</span>
                {c.notes ? (
                  <span className="text-xs text-muted">{c.notes}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function PriceTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card
      surface={highlight ? "shell" : "paper"}
      elevation="1"
      radius="lg"
      className="space-y-2"
    >
      <p className="label-uppercase text-muted">{label}</p>
      <p
        className={
          highlight
            ? "text-2xl font-semibold leading-tight text-olive"
            : "text-xl font-semibold leading-tight text-ink"
        }
      >
        {value}
      </p>
    </Card>
  );
}
