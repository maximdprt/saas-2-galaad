"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { analysisToMarkdown } from "@/lib/export/markdown";
import type { BusinessAnalysis } from "@/lib/types";

export function ExportPanel({ analysis }: { analysis: BusinessAnalysis }) {
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">(
    "idle",
  );

  function downloadMarkdown() {
    const md = analysisToMarkdown(analysis);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = analysis.idea
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "analyse";
    link.href = url;
    link.download = `${slug}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function copyForNotion() {
    try {
      await navigator.clipboard.writeText(analysisToMarkdown(analysis));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  function printPdf() {
    window.print();
  }

  return (
    <Card
      surface="shell"
      elevation="1"
      radius="lg"
      className="space-y-4 print-hide"
    >
      <p className="label-uppercase text-muted">Exporter ce rapport</p>
      <p className="text-sm leading-relaxed text-muted">
        Markdown prêt pour Notion ou Obsidian. PDF via l'impression du
        navigateur (la mise en page est optimisée).
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={downloadMarkdown}
          withArrow={false}
        >
          Télécharger Markdown
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={copyForNotion}
          withArrow={false}
        >
          {copyState === "copied"
            ? "Copié"
            : copyState === "error"
              ? "Échec copie"
              : "Copier pour Notion"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={printPdf}
          withArrow={false}
        >
          Imprimer / PDF
        </Button>
      </div>
    </Card>
  );
}
