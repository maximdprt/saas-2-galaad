import type { ClarificationAnswer } from "@/lib/types";

export const ANALYZE_INSTRUCTIONS = `Tu produis une analyse business complète et honnête, en français, sous forme de JSON structuré.

Structure ton analyse avec :
- summary : 2 à 4 phrases, résumé honnête de ce qui est proposé.
- viabilityScore : 0-100. Calibre sérieusement. Pas de score "75 par défaut".
- verdict : "go", "go-conditions", "pivot", "no-go", ou "too-vague".
- market : segment ciblé, taille estimée (en marquant clairement "estimation"), signaux de croissance, niveau de saturation, notes. market.saturation doit être EXACTEMENT "low", "medium" ou "high" en anglais.
- competitors : 3 à 6 concurrents (directs, indirects ou alternatives). Chaque concurrent doit être un objet complet, jamais une simple chaîne. Format obligatoire : { "name": string, "type": "direct" | "indirect" | "alternative", "positioning": string, "pricing": string, "strengths": string[], "weaknesses": string[], "differentiation": string }. N'invente JAMAIS de noms réels que tu ne connais pas avec certitude. Si tu ne connais pas, utilise un nom générique comme "Alternative actuelle : comptes Instagram gratuits" ou "Type de concurrent : applications de citations gratuites".
- strengths : 3 à 5 points forts réels.
- weaknesses : 3 à 5 faiblesses identifiées.
- risks : 5 à 8 risques concrets en français, courts.
- riskScores : exactement 7 entrées, une par catégorie. Le champ key doit être EXACTEMENT l'une de ces valeurs anglaises : "market", "competition", "acquisition", "technical", "financial", "legal", "execution". N'utilise jamais "marché", "concurrence", "risque marché" ou des clés traduites. Chaque entrée a label (FR), level (low/medium/high), score (0-100, plus haut = plus risqué), why et mitigation.
- assumptions : hypothèses critiques à valider en priorité.
- advice : 4 à 7 conseils actionnables.
- positioning : phrase de positionnement recommandée, courte.
- acquisitionChannels : canaux d'acquisition réalistes pour démarrer (3 à 5).
- criticalQuestions : 5 à 8 questions dures que le fondateur doit se poser.
- idealCustomer : profil concret, avec acheteur, utilisateur final si différent, problème, douleur, willingnessToPay, where to find, convaincants, objections, signaux d'urgence, segments à prioriser, segments à éviter.
- monetization : 3 à 6 modèles évalués (subscription / commission / freemium / usage-based / one-shot / premium-tier / service). Pour chacun : pros, cons, complexity, fit, recommended (un seul à true), rationale. recommendedMonetization doit pointer le modèle "recommended: true".
- investorQuestions : 6 à 10 questions investisseurs avec whyItMatters et suggestedAngle.
- validationPlan : messages LinkedIn (2-4 templates), 6-10 interviewQuestions, discoveryScript (texte fluide), landingTest, manualOffer, conciergeMVP, métriques (3-6), positiveSignals, negativeSignals, thresholds (continue/pivot/stop avec critère chiffré quand possible).
- mvpPlan : topThree (3 features must-build), avoid, doNotBuildV1, sevenDay/thirtyDay/ninetyDay (listes d'actions), manualNoCode (description d'une version manuelle pour tester avant de coder).
- pricing : competitorPricing (avec note "estimation" ou "fait connu"), realisticRange, launchPrice, mvpPricing, advancedPricing, justification.
- businessModelCanvas : les 9 cases + defensibleAdvantages (peut être []).
- sources : si tu cites des chiffres, mets-les ici avec kind = "fact" | "estimate" | "assumption". N'INVENTE PAS d'URLs. Sans recherche web active, ne mets que des "estimate" ou "assumption" sans URL.
- goNoGo : verdict (le même que verdict racine), why, conditions, validateFirst, next48h.

Règles :
- Si l'idée est trop vague, mets verdict "too-vague", viabilityScore en dessous de 35, et explique dans summary et goNoGo.why pourquoi tu ne peux pas conclure proprement.
- Sois calibré sur les scores : la majorité des idées non testées tombent entre 35 et 65.
- Pas de remplissage. Si tu ne sais pas, écris-le.
- N'invente jamais de noms de boîtes réelles, d'études, de chiffres précis.
- Les valeurs d'enum doivent rester en anglais exactement comme demandé, même si tout le texte explicatif est en français.
- Reste exigeant et constructif.`;

export const ANALYZE_SCHEMA_NOTES = `Notes importantes pour respecter le schéma :
- idealCustomer.buyer / idealCustomer.problem / idealCustomer.pain sont obligatoires. Si tu ne sais pas, écris explicitement "Non précisé (à clarifier)" plutôt que de laisser vide.
- market.growthSignals doit être une liste (array) de chaînes, jamais une seule string.
- market.saturation doit être "low" | "medium" | "high" (pas "moyen").
- monetization[].label est obligatoire (même si redondant).
- monetization[].fit et monetization[].complexity doivent être "low" | "medium" | "high" (pas "moyen").`;

export function buildAnalyzeUserMessage(
  idea: string,
  clarifications: ClarificationAnswer[],
  liveSearchAvailable: boolean,
): string {
  const clarif =
    clarifications.length > 0
      ? `\nPrécisions du fondateur :\n${clarifications
          .map((c, i) => `${i + 1}. (${c.questionId}) ${c.answer}`)
          .join("\n")}`
      : "";

  const search = liveSearchAvailable
    ? "Recherche web active : tu peux citer des sources réelles dans `sources` avec kind = \"fact\" et un url quand tu l'as."
    : "Recherche web non active : ne cite aucune URL. Marque toutes les données chiffrées comme \"estimate\" ou \"assumption\" dans `sources`. Le rapport indiquera clairement que l'analyse n'utilise pas de recherche live.";

  return `Idée business :\n"""\n${idea.trim()}\n"""${clarif}\n\n${search}\n\nProduis l'analyse JSON complète selon le schéma demandé.`;
}
