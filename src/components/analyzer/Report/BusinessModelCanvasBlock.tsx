import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import type { BusinessModelCanvas } from "@/lib/types";

interface CellProps {
  label: string;
  items: string[];
  className?: string;
  surface?: "paper" | "shell" | "mist";
}

function Cell({
  label,
  items,
  className,
  surface = "paper",
}: CellProps) {
  return (
    <Card
      surface={surface}
      elevation="1"
      radius="lg"
      className={`space-y-2 ${className ?? ""}`}
    >
      <p className="label-uppercase text-muted">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-light">_(vide)_</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 leading-relaxed">
              <span className="mt-2 inline-block h-1 w-1 rounded-full bg-olive" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function BusinessModelCanvasBlock({
  canvas,
}: {
  canvas: BusinessModelCanvas;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Business Model Canvas"
        title={
          <>
            Le canvas{" "}
            <span className="font-serif-italic text-olive">complet</span>
          </>
        }
        description="9 cases pour visualiser le business sur une seule page. Avantages défendables au bout."
      />

      <div className="grid gap-3 lg:grid-cols-5">
        <Cell label="Partenaires clés" items={canvas.keyPartners} />
        <div className="grid gap-3">
          <Cell label="Activités clés" items={canvas.keyActivities} />
          <Cell label="Ressources clés" items={canvas.keyResources} />
        </div>
        <Cell
          label="Proposition de valeur"
          items={canvas.valueProposition}
          surface="shell"
        />
        <div className="grid gap-3">
          <Cell label="Relation client" items={canvas.customerRelationships} />
          <Cell label="Canaux" items={canvas.channels} />
        </div>
        <Cell label="Segments clients" items={canvas.customerSegments} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Cell label="Structure de coûts" items={canvas.costStructure} />
        <Cell label="Sources de revenus" items={canvas.revenueStreams} />
      </div>

      {canvas.defensibleAdvantages.length > 0 ? (
        <Card surface="ink" elevation="2" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted-light">
            Avantages défendables
          </p>
          <ul className="space-y-1.5 text-sm">
            {canvas.defensibleAdvantages.map((a, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-gold" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
