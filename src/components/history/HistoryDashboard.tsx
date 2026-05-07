"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Field";
import { LoadingState } from "@/components/ui/LoadingState";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { analysesStore } from "@/lib/storage/analyses";
import { formatDate, truncate } from "@/lib/utils";
import type { AnalysisStatus, BusinessAnalysis, Verdict } from "@/lib/types";

const verdictMeta: Record<
  Verdict,
  { label: string; tone: "success" | "gold" | "warning" | "danger" | "neutral" }
> = {
  go: { label: "GO", tone: "success" },
  "go-conditions": { label: "GO conditions", tone: "gold" },
  pivot: { label: "Pivot", tone: "warning" },
  "no-go": { label: "NO-GO", tone: "danger" },
  "too-vague": { label: "Trop flou", tone: "neutral" },
};

const verdictTabs: { id: "all" | Verdict; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "go", label: "Go" },
  { id: "go-conditions", label: "Conditions" },
  { id: "pivot", label: "Pivot" },
  { id: "no-go", label: "No-go" },
  { id: "too-vague", label: "Flou" },
];

const statusLabel: Record<AnalysisStatus, string> = {
  draft: "Brouillon",
  completed: "Terminee",
  "needs-clarification": "A preciser",
  archived: "Archivee",
};

export function HistoryDashboard() {
  const router = useRouter();
  const [items, setItems] = React.useState<BusinessAnalysis[] | null>(null);
  const [verdictFilter, setVerdictFilter] = React.useState<"all" | Verdict>(
    "all",
  );
  const [search, setSearch] = React.useState("");
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(analysesStore.list());
  }, []);

  function refresh() {
    setItems(analysesStore.list());
  }

  function handleDelete(id: string) {
    analysesStore.remove(id);
    setConfirmId(null);
    refresh();
  }

  if (items === null) {
    return (
      <div className="mx-auto w-full max-w-[1080px] px-5 py-12 sm:px-8">
        <LoadingState title="Ouverture de l'historique..." />
      </div>
    );
  }

  const filtered = items
    .filter((a) =>
      verdictFilter === "all" ? true : a.verdict === verdictFilter,
    )
    .filter((a) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        a.idea.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.market.segment.toLowerCase().includes(q)
      );
    });

  return (
    <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 lg:px-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-sand pb-6">
        <div>
          <p className="label-uppercase text-muted">Historique</p>
          <h1 className="mt-2 text-4xl font-bold uppercase leading-none sm:text-5xl">
            Idees testees
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Les rapports Noyau sont stockes localement dans ce navigateur.
            Rouvre une analyse, discute avec le mentor ou supprime ce qui
            n&apos;est plus utile.
          </p>
        </div>
        <Button onClick={() => router.push("/")} size="md">
          Nouvelle analyse
        </Button>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Aucune analyse"
          description="Lance un premier test. Le rapport apparaitra ici."
          action={
            <Button onClick={() => router.push("/")} variant="primary" size="md">
              Decrire mon idee
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              tabs={verdictTabs.map((t) => ({ id: t.id, label: t.label }))}
              active={verdictFilter}
              onChange={(id) => setVerdictFilter(id as "all" | Verdict)}
            />
            <div className="w-full max-w-sm">
              <Input
                placeholder="Rechercher une idee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card surface="paper" elevation="flat" radius="lg">
              <p className="text-sm text-muted">
                Aucune idee ne correspond a ces filtres.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-3">
              {filtered.map((a) => (
                <li key={a.id}>
                  <Card
                    surface="paper"
                    elevation="flat"
                    radius="lg"
                    className="grid gap-4 border-ink p-5 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-start"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tone={verdictMeta[a.verdict].tone}>
                          {verdictMeta[a.verdict].label}
                        </Tag>
                        <Tag tone="neutral">{statusLabel[a.status]}</Tag>
                        <span className="text-xs text-muted">
                          {formatDate(a.createdAt)}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold leading-snug">
                        {truncate(a.idea, 150)}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {truncate(a.summary, 230)}
                      </p>
                    </div>

                    <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="text-left sm:text-right">
                        <span className="font-mono text-4xl font-bold tabular-nums text-ink">
                          {a.viabilityScore}
                        </span>
                        <span className="ml-1 text-xs text-muted">/100</span>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link href={`/analysis/${a.id}`}>
                          <Button size="sm" variant="primary" withArrow={false}>
                            Ouvrir
                          </Button>
                        </Link>
                        <Link href={`/analysis/${a.id}/mentor`}>
                          <Button
                            size="sm"
                            variant="secondary"
                            withArrow={false}
                          >
                            Mentor
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="border-t border-sand pt-3 sm:col-span-2">
                      {confirmId === a.id ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted">
                            Supprimer cette analyse ?
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            withArrow={false}
                            onClick={() => setConfirmId(null)}
                          >
                            Annuler
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            withArrow={false}
                            onClick={() => handleDelete(a.id)}
                            className="text-danger"
                          >
                            Supprimer
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          withArrow={false}
                          onClick={() => setConfirmId(a.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
