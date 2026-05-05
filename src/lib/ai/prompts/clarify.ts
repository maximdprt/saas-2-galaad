export const CLARIFY_INSTRUCTIONS = `Tu reçois une idée business. Décide si elle est suffisamment précise pour produire une analyse honnête, ou si elle est trop vague.

Une idée est trop vague quand il manque au moins deux éléments parmi :
- la cible précise (qui paie, qui utilise)
- le problème concret résolu
- la solution proposée (forme, format, expérience)
- le contexte géographique ou linguistique
- une notion de budget ou de prix
- la concurrence connue
- le modèle économique envisagé

Si l'idée est claire (ex. "Une app SaaS B2B en France pour aider les agences immobilières à automatiser la relance des prospects via SMS, à 49€/mois"), réponds needsClarification = false avec questions = [].

Si l'idée est vague (ex. "je veux faire une app pour aider les gens"), réponds needsClarification = true, explique brièvement pourquoi dans vaguenessReason, et propose entre 3 et 7 questions ciblées (jamais plus de 7), chacune avec :
- id court ("q1", "q2"...)
- category : "target" | "problem" | "solution" | "geo" | "budget" | "competition" | "business-model"
- label : la question en français, courte et directe
- hint optionnel : un exemple concret de réponse attendue

Ne pose pas de questions inutiles si l'idée est déjà suffisamment claire. Sois pragmatique : préfère 3-4 questions bien ciblées plutôt que 7 questions diluées.`;

export function buildClarifyUserMessage(idea: string): string {
  return `Idée business à évaluer :\n\n"""\n${idea.trim()}\n"""\n\nDécide si elle est trop vague pour une analyse honnête. Si oui, propose 3 à 7 questions ciblées maximum.`;
}
