"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { SectionHeader } from "@/components/ui/Section";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { toArr } from "@/lib/utils";
import type { Competitor, CompetitorType } from "@/lib/types";

const tabs: { id: "all" | CompetitorType; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "direct", label: "Directs" },
  { id: "indirect", label: "Indirects" },
  { id: "alternative", label: "Alternatives" },
];

const typeTone: Record<CompetitorType, "info" | "gold" | "neutral"> = {
  direct: "info",
  indirect: "gold",
  alternative: "neutral",
};

export function CompetitorsTable({
  competitors,
}: {
  competitors: Competitor[];
}) {
  const [active, setActive] = React.useState<"all" | CompetitorType>("all");
  const filtered =
    active === "all"
      ? competitors
      : competitors.filter((c) => c.type === active);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Concurrence"
        title={
          <>
            Concurrents directs, indirects et{" "}
            <span className="font-serif-italic text-olive">alternatives</span>
          </>
        }
        description="Comparaison des positionnements, forces, faiblesses et opportunités de différenciation."
        actions={
          <Tabs
            tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
            active={active}
            onChange={(id) => setActive(id as "all" | CompetitorType)}
          />
        }
      />

      <DataTable
        rows={filtered as unknown as Record<string, unknown>[]}
        empty="Aucun concurrent dans cette catégorie."
        columns={[
          {
            key: "name",
            header: "Concurrent",
            render: (row) => {
              const c = row as unknown as Competitor;
              return (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-ink">{c.name}</span>
                  <Tag tone={typeTone[c.type]} size="sm">
                    {c.type === "direct"
                      ? "Direct"
                      : c.type === "indirect"
                        ? "Indirect"
                        : "Alternative"}
                  </Tag>
                </div>
              );
            },
          },
          {
            key: "positioning",
            header: "Positionnement",
            render: (row) => (
              <span className="text-sm leading-relaxed text-ink">
                {(row as unknown as Competitor).positioning}
              </span>
            ),
          },
          {
            key: "pricing",
            header: "Prix",
            render: (row) => {
              const p = (row as unknown as Competitor).pricing;
              return p ? (
                <span className="text-sm">{p}</span>
              ) : (
                <span className="text-xs text-muted-light">non renseigné</span>
              );
            },
          },
          {
            key: "strengths",
            header: "Forces",
            render: (row) => (
              <ul className="space-y-1 text-sm">
                {toArr((row as unknown as Competitor).strengths).map((s, i) => (
                  <li key={i}>· {s}</li>
                ))}
              </ul>
            ),
          },
          {
            key: "weaknesses",
            header: "Faiblesses",
            render: (row) => (
              <ul className="space-y-1 text-sm">
                {toArr((row as unknown as Competitor).weaknesses).map((w, i) => (
                  <li key={i}>· {w}</li>
                ))}
              </ul>
            ),
          },
          {
            key: "differentiation",
            header: "Opportunité de diff.",
            render: (row) => (
              <span className="text-sm leading-relaxed text-olive">
                {(row as unknown as Competitor).differentiation}
              </span>
            ),
          },
        ]}
      />

      {competitors.length > 0 ? (
        <Card surface="shell" elevation="flat" bordered className="text-sm leading-relaxed text-muted">
          Ces concurrents incluent des estimations et des catégories
          d'alternatives quand aucun acteur réel n'est connu avec certitude.
          Vérifie sur le terrain avant de bâtir un positionnement définitif.
        </Card>
      ) : null}
    </div>
  );
}
