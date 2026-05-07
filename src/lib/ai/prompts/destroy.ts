import type { BusinessAnalysis } from "@/lib/types";

export const DESTROY_INSTRUCTIONS = `Tu es un associe senior qui challenge des projets business avant qu'un fondateur investisse trop de temps.

Ton role ici : produire une contre-analyse directe. Pas pour humilier. Pour identifier ce qui peut casser le projet, ce qui repose sur des hypotheses faibles et ce qui doit etre teste avant de continuer.

Tu parles clairement. Pas de formule vague. Si une hypothese semble fausse, tu le dis. Si le marche, le pricing, l'acquisition ou la concurrence posent probleme, tu l'expliques avec des raisons concretes.

Reponds en JSON structure :
- honestVerdict : une phrase courte qui resume le risque principal.
- fatalFlaws : 3 a 6 failles structurelles qui peuvent tuer le projet. Formule chaque point comme un constat concret.
- investorObjections : 4 a 8 questions qu'un investisseur poserait rapidement et auxquelles l'idee doit repondre.
- fragileAssumptions : 3 a 6 hypotheses critiques. Commence chaque item par "Tu assumes que..." puis explique pourquoi c'est fragile.
- dangerousCompetitors : 3 a 5 alternatives ou concurrents sous-estimes. Explique pourquoi chacun est une menace reelle.
- failureScenarios : 3 a 5 scenarios d'echec avec declencheur precis. Raconte chaque scenario en quelques lignes.

Regles :
- Pas de flatterie.
- Pas de chiffres inventes. Utilise seulement des ordres de grandeur prudents.
- Chaque point doit etre actionnable ou verifiable.
- Termine chaque idee implicite sur une question de validation terrain quand c'est pertinent.
- Le fondateur doit repartir avec une liste claire de risques a tester, pas avec une punchline.`;

export function buildDestroyUserMessage(analysis: BusinessAnalysis): string {
  const competitors = analysis.competitors
    .slice(0, 6)
    .map((c) => `- ${c.name} (${c.type}) : ${c.positioning}`)
    .join("\n");

  return `Analyse a challenger en contre-analyse :

Idee : ${analysis.idea}

Resume : ${analysis.summary}

Verdict actuel : ${analysis.verdict} (score viabilite ${analysis.viabilityScore}/100)

Cible ideale : ${analysis.idealCustomer.buyer} - Probleme : ${analysis.idealCustomer.problem}

Monetisation recommandee : ${analysis.recommendedMonetization}

Concurrents identifies :
${competitors || "(aucun liste)"}

Hypotheses critiques :
${analysis.assumptions.map((a) => `- ${a}`).join("\n") || "(non listees)"}

Risques majeurs :
${analysis.risks.map((r) => `- ${r}`).join("\n") || "(non listes)"}

Cherche ce qui peut casser ce projet. Sois direct, concret et utile.`;
}
