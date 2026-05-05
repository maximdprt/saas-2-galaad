import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/Section";
import type { MVPPlan } from "@/lib/types";

export function MVPGeneratorBlock({ plan }: { plan: MVPPlan }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="MVP"
        title={
          <>
            Que construire —{" "}
            <span className="font-serif-italic text-olive">et que ne PAS construire</span>
          </>
        }
        description="3 features must-build, ce qu'il faut éviter, roadmaps 7/30/90 jours et version manuelle pour tester sans coder."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">3 features must-build</p>
          <ul className="space-y-2 text-sm">
            {plan.topThree.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-sand bg-shell p-3"
              >
                <span className="font-mono text-xs font-semibold text-olive">
                  0{i + 1}
                </span>
                <span className="leading-relaxed text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">À éviter</p>
          <ul className="space-y-1.5 text-sm">
            {plan.avoid.map((f, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-coral" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">
            Ne PAS construire en V1
          </p>
          <ul className="space-y-1.5 text-sm">
            {plan.doNotBuildV1.map((f, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-danger" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Roadmap label="Roadmap 7 jours" items={plan.sevenDay} />
        <Roadmap label="Roadmap 30 jours" items={plan.thirtyDay} />
        <Roadmap label="Roadmap 90 jours" items={plan.ninetyDay} />
      </div>

      <Callout tone="info" title="Version manuelle / no-code">
        {plan.manualNoCode}
      </Callout>
    </div>
  );
}

function Roadmap({ label, items }: { label: string; items: string[] }) {
  return (
    <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
      <p className="label-uppercase text-muted">{label}</p>
      <ol className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 leading-relaxed">
            <span className="font-mono text-xs text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink">{it}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
