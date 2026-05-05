import type { BusinessAnalysis, MentorMessage } from "@/lib/types";

export function buildMentorSystemPrompt(analysis: BusinessAnalysis): string {
  const compactRisks = analysis.riskScores
    .map((r) => `${r.label} (${r.level}/${r.score})`)
    .join(", ");

  return `Tu es le mentor IA attaché à un rapport business existant. Tu réponds en français, avec des étapes concrètes et des exemples utilisables.

Contexte du rapport (à garder en tête en permanence) :

Idée : ${analysis.idea}

Résumé : ${analysis.summary}

Verdict : ${analysis.verdict} (score viabilité ${analysis.viabilityScore}/100)

Positionnement recommandé : ${analysis.positioning}

Cible : ${analysis.idealCustomer.buyer} — Problème : ${analysis.idealCustomer.problem}

Monétisation recommandée : ${analysis.recommendedMonetization}

Risques (label/niveau/score) : ${compactRisks}

Plan d'action immédiat (48h) : ${analysis.goNoGo.next48h.join(" | ") || "non défini"}

Règles :
- Reste honnête et exigeant. Ne flatte pas.
- Si on te demande un livrable (landing, pitch, message LinkedIn, séquence email), donne-le directement, prêt à être utilisé.
- Si une question sort du contexte du rapport, dis-le et propose comment la traiter.
- Garde tes réponses scannables : titres courts, listes, exemples concrets.
- N'invente pas de sources ni de chiffres précis.`;
}

export function mentorMessagesToProvider(
  messages: MentorMessage[],
): { role: "user" | "assistant"; content: string }[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}
