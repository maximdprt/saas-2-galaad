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
import type {
  AnalysisStatus,
  BusinessAnalysis,
  Verdict,
} from "@/lib/types";

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
  { id: "go-conditions", label: "Go conditions" },
  { id: "pivot", label: "Pivot" },
  { id: "no-go", label: "No-go" },
  { id: "too-vague", label: "Trop flou" },
];

const statusLabel: Record<AnalysisStatus, string> = {
  draft: "Brouillon",
  completed: "Terminée",
  "needs-clarification": "À préciser",
  archived: "Archivée",
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
        <LoadingState title="Ouverture de l'historique…" />
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
    <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-uppercase text-muted">Historique</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Tes idées{" "}
            <span className="font-serif-italic text-olive">analysées</span>
          </h1>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
            Tout est stocké localement dans ce navigateur. Ouvre une analyse
            pour reprendre, ou supprime ce que tu n'utilises plus.
          </p>
        </div>
        <Button onClick={() => router.push("/")} size="md">
          Lancer une nouvelle analyse
        </Button>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Pas encore d'analyse"
          description="Lance ta première analyse honnête — texte ou voix. Elle apparaîtra ici."
          action={
            <Button
              onClick={() => router.push("/")}
              variant="primary"
              size="md"
            >
              Décrire mon idée
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              tabs={verdictTabs.map((t) => ({ id: t.id, label: t.label }))}
              active={verdictFilter}
              onChange={(id) =>
                setVerdictFilter(id as "all" | Verdict)
              }
            />
            <div className="w-full max-w-xs">
              <Input
                placeholder="Rechercher une idée…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card surface="paper" elevation="1" radius="lg">
              <p className="text-sm text-muted">
                Aucune idée ne correspond à ces filtres.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-4">
              {filtered.map((a) => (
                <li key={a.id}>
                  <Card
                    surface="paper"
                    elevation="1"
                    radius="lg"
                    className="group flex flex-col gap-4 transition-shadow hover:shadow-[var(--shadow-level-2)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag tone={verdictMeta[a.verdict].tone}>
                            {verdictMeta[a.verdict].label}
                          </Tag>
                          <Tag tone="neutral">{statusLabel[a.status]}</Tag>
                          <span className="text-xs text-muted">
                            {formatDate(a.createdAt)}
                          </span>
                        </div>
                        <h2 className="mt-3 text-lg font-semibold leading-snug">
                          {truncate(a.idea, 140)}
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {truncate(a.summary, 220)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="font-mono text-3xl font-semibold tabular-nums text-ink">
                          {a.viabilityScore}
                        </span>
                        <span className="text-xs text-muted">/ 100</span>
                      </div>
                    </div>

                    {a.goNoGo.next48h.length > 0 ? (
                      <div className="rounded-2xl border border-sand bg-shell px-4 py-3">
                        <p className="label-uppercase text-muted">
                          Action 48h
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink">
                          {a.goNoGo.next48h[0]}
                        </p>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/analysis/${a.id}`}>
                          <Button size="sm" variant="primary" withArrow={false}>
                            Rouvrir
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
                      {confirmId === a.id ? (
                        <div className="flex items-center gap-2">
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
