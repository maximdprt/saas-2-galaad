import { Tag } from "./Tag";
import type { Source } from "@/lib/types";

const kindMeta: Record<
  Source["kind"],
  { label: string; tone: "info" | "gold" | "neutral" }
> = {
  fact: { label: "Fait", tone: "info" },
  estimate: { label: "Estimation", tone: "gold" },
  assumption: { label: "Hypothèse", tone: "neutral" },
};

interface SourceListProps {
  sources: Source[];
  liveSearchUsed: boolean;
}

export function SourceList({ sources, liveSearchUsed }: SourceListProps) {
  return (
    <div className="rounded-lg border border-sand bg-shell p-6 shadow-[var(--shadow-level-1)]">
      <div className="flex items-center justify-between gap-3">
        <p className="label-uppercase text-muted">Sources & confiance</p>
        <Tag tone={liveSearchUsed ? "info" : "neutral"}>
          {liveSearchUsed
            ? "Recherche web active"
            : "Pas de recherche live"}
        </Tag>
      </div>

      {!liveSearchUsed ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          L'analyse est basée sur les informations fournies. Les chiffres sont
          marqués comme estimations ou hypothèses, jamais comme faits vérifiés.
        </p>
      ) : null}

      {sources.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          Aucune source citée pour ce rapport.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sources.map((s, i) => {
            const meta = kindMeta[s.kind];
            const content = (
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <Tag tone={meta.tone} size="sm">
                    {meta.label}
                  </Tag>
                  <span className="font-medium text-ink">{s.title}</span>
                </span>
                {(s.origin || s.date) ? (
                  <span className="text-xs text-muted">
                    {[s.origin, s.date].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
                {s.note ? (
                  <span className="text-xs text-muted">{s.note}</span>
                ) : null}
              </span>
            );
            return (
              <li key={i} className="text-sm">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vivid-blue underline-offset-4 hover:underline"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
