import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import type { InvestorQuestion } from "@/lib/types";

export function InvestorQuestionsBlock({
  questions,
}: {
  questions: InvestorQuestion[];
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Façon investisseur"
        title={
          <>
            Les questions{" "}
            <span className="font-serif-italic text-olive">dures</span> à se poser
          </>
        }
        description="Anticipe les objections d'un investisseur expérimenté — ou d'un client qui aurait déjà tout vu."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {questions.map((q, i) => (
          <Card
            key={i}
            surface="paper"
            elevation="1"
            radius="lg"
            className="space-y-3"
          >
            <p className="text-base font-semibold leading-snug text-ink">
              {q.question}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              <span className="label-uppercase mr-2 text-muted">
                Pourquoi ça compte
              </span>
              {q.whyItMatters}
            </p>
            <p className="text-sm leading-relaxed text-ink">
              <span className="label-uppercase mr-2 text-muted">
                Angle suggéré
              </span>
              {q.suggestedAngle}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
