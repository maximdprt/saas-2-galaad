"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Section } from "@/components/ui/Section";
import { SourceList } from "@/components/ui/SourceList";
import { Tag } from "@/components/ui/Tag";
import { VerdictPanel } from "@/components/ui/VerdictPanel";
import { analysesStore } from "@/lib/storage/analyses";
import type { AnalysisStatus, BusinessAnalysis } from "@/lib/types";
import { ReportSummary } from "./ReportSummary";
import { StrengthsWeaknessesBlock } from "./StrengthsWeaknessesBlock";
import { RiskScoresPanel } from "./RiskScoresPanel";
import { CompetitorsTable } from "./CompetitorsTable";
import { IdealCustomerCard } from "./IdealCustomerCard";
import { MonetizationTest } from "./MonetizationTest";
import { PricingBenchmarkBlock } from "./PricingBenchmark";
import { MVPGeneratorBlock } from "./MVPGenerator";
import { FieldValidationPlanBlock } from "./FieldValidationPlan";
import { InvestorQuestionsBlock } from "./InvestorQuestions";
import { BusinessModelCanvasBlock } from "./BusinessModelCanvasBlock";
import { DestroySection } from "./DestroySection";
import { ExportPanel } from "./ExportPanel";
import { SectionAnchors } from "./SectionAnchors";

const SECTIONS = [
  { id: "summary", label: "Résumé & verdict" },
  { id: "diagnostic", label: "Forces & faiblesses" },
  { id: "risks", label: "Risques (×7)" },
  { id: "competitors", label: "Concurrence" },
  { id: "icp", label: "Client idéal" },
  { id: "monetization", label: "Monétisation" },
  { id: "pricing", label: "Pricing" },
  { id: "mvp", label: "MVP" },
  { id: "validation", label: "Validation terrain" },
  { id: "investor", label: "Façon investisseur" },
  { id: "canvas", label: "Business Model Canvas" },
  { id: "sources", label: "Sources" },
  { id: "verdict", label: "Verdict Go/No-Go" },
  { id: "destroy", label: "Mode contradicteur" },
];

const statusLabel: Record<AnalysisStatus, string> = {
  draft: "Brouillon",
  completed: "Terminée",
  "needs-clarification": "À préciser",
  archived: "Archivée",
};

export function ReportPage({ id }: { id: string }) {
  const router = useRouter();
  const [analysis, setAnalysis] = React.useState<BusinessAnalysis | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const a = analysesStore.get(id);
    setAnalysis(a ?? null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="mx-auto w-full max-w-[1080px] px-5 py-12 sm:px-8">
        <LoadingState title="Ouverture du rapport…" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8">
        <EmptyState
          title="Cette analyse est introuvable"
          description="Elle a peut-être été supprimée, ou tu utilises un autre navigateur. Lance une nouvelle analyse pour repartir."
          action={
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => router.push("/")} withArrow={false}>
                Nouvelle analyse
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/history")}
                withArrow={false}
              >
                Voir l'historique
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
        <article className="min-w-0 space-y-12">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="ink">{statusLabel[analysis.status]}</Tag>
              <Tag tone="neutral">
                Mis à jour {new Date(analysis.updatedAt).toLocaleString("fr-FR")}
              </Tag>
            </div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Analyse{" "}
              <span className="font-serif-italic text-olive">honnête</span> de
              ton idée
            </h1>
            <div className="flex flex-wrap gap-2 print-hide">
              <Link href={`/analysis/${analysis.id}/mentor`}>
                <Button variant="primary" size="sm" withArrow>
                  Discuter avec le mentor IA
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                withArrow={false}
                onClick={() => router.push("/")}
              >
                Nouvelle analyse
              </Button>
              <Button
                variant="ghost"
                size="sm"
                withArrow={false}
                onClick={() => router.push("/history")}
              >
                Historique
              </Button>
            </div>
          </header>

          {analysis.verdict === "too-vague" ? (
            <Callout tone="warning" title="Idée trop floue">
              L'IA n'a pas pu produire une analyse fiable. Précise la cible, le
              problème, la solution et le contexte, puis relance une nouvelle
              analyse.
            </Callout>
          ) : null}

          <Section id="summary" className="space-y-6">
            <ReportSummary analysis={analysis} />
          </Section>

          <Section id="diagnostic">
            <StrengthsWeaknessesBlock analysis={analysis} />
          </Section>

          <Section id="risks">
            <RiskScoresPanel analysis={analysis} />
          </Section>

          <Section id="competitors">
            <CompetitorsTable competitors={analysis.competitors} />
          </Section>

          <Section id="icp">
            <IdealCustomerCard icp={analysis.idealCustomer} />
          </Section>

          <Section id="monetization">
            <MonetizationTest
              options={analysis.monetization}
              recommended={analysis.recommendedMonetization}
            />
          </Section>

          <Section id="pricing">
            <PricingBenchmarkBlock pricing={analysis.pricing} />
          </Section>

          <Section id="mvp">
            <MVPGeneratorBlock plan={analysis.mvpPlan} />
          </Section>

          <Section id="validation">
            <FieldValidationPlanBlock plan={analysis.validationPlan} />
          </Section>

          <Section id="investor">
            <InvestorQuestionsBlock questions={analysis.investorQuestions} />
          </Section>

          <Section id="canvas">
            <BusinessModelCanvasBlock canvas={analysis.businessModelCanvas} />
          </Section>

          <Section id="sources" className="space-y-6">
            <SourceList
              sources={analysis.sources}
              liveSearchUsed={analysis.liveSearchUsed}
            />
          </Section>

          <Section id="verdict">
            <VerdictPanel
              verdict={analysis.goNoGo.verdict}
              why={analysis.goNoGo.why}
              conditions={analysis.goNoGo.conditions}
              validateFirst={analysis.goNoGo.validateFirst}
              next48h={analysis.goNoGo.next48h}
              score={analysis.viabilityScore}
            />
          </Section>

          <Section id="destroy">
            <DestroySection
              analysis={analysis}
              onUpdate={(a) => setAnalysis(a)}
            />
          </Section>

          <Card
            surface="paper"
            elevation="1"
            radius="lg"
            className="print-hide"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-uppercase text-muted">Et après ?</p>
                <p className="mt-1 text-base leading-relaxed text-ink">
                  Garde le contexte du rapport et discute des prochains pas avec
                  le mentor IA.
                </p>
              </div>
              <Link href={`/analysis/${analysis.id}/mentor`}>
                <Button variant="primary" size="md">
                  Ouvrir le mentor IA
                </Button>
              </Link>
            </div>
          </Card>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 print-hide">
            <SectionAnchors items={SECTIONS} />
            <ExportPanel analysis={analysis} />
          </div>
        </aside>
      </div>

      <div className="mt-10 lg:hidden print-hide">
        <ExportPanel analysis={analysis} />
      </div>
    </div>
  );
}
