import type { BusinessAnalysis } from "@/lib/types";

const verdictLabel: Record<BusinessAnalysis["verdict"], string> = {
  go: "GO — Tester vite",
  "go-conditions": "GO sous conditions",
  pivot: "Pivot recommandé",
  "no-go": "NO-GO pour l'instant",
  "too-vague": "Trop flou pour conclure",
};

const monetizationLabel: Record<string, string> = {
  subscription: "Abonnement",
  commission: "Commission",
  freemium: "Freemium",
  "usage-based": "Usage-based",
  "one-shot": "Paiement one-shot",
  "premium-tier": "Offre premium",
  service: "Service accompagné",
};

function bullets(items: string[]): string {
  if (!items?.length) return "_(non renseigné)_";
  return items.map((i) => `- ${i}`).join("\n");
}

export function analysisToMarkdown(a: BusinessAnalysis): string {
  const lines: string[] = [];
  lines.push(`# Analyse : ${truncate(a.idea, 90)}`);
  lines.push("");
  lines.push(`> **Verdict** : ${verdictLabel[a.verdict]}  `);
  lines.push(`> **Score viabilité** : ${a.viabilityScore}/100  `);
  lines.push(`> **Recherche web active** : ${a.liveSearchUsed ? "oui" : "non"}`);
  lines.push("");
  lines.push("## Idée");
  lines.push(a.idea);
  if (a.clarifications.length > 0) {
    lines.push("");
    lines.push("### Précisions du fondateur");
    a.clarifications.forEach((c, i) => {
      lines.push(`${i + 1}. _(${c.questionId})_ ${c.answer}`);
    });
  }

  lines.push("");
  lines.push("## Résumé");
  lines.push(a.summary);

  lines.push("");
  lines.push("## Marché");
  lines.push(`- Segment : ${a.market.segment}`);
  lines.push(`- Taille estimée : ${a.market.estimatedSize}`);
  lines.push(`- Saturation : ${a.market.saturation}`);
  if (a.market.growthSignals?.length) {
    lines.push("- Signaux de croissance :");
    lines.push(bullets(a.market.growthSignals).replace(/^- /gm, "  - "));
  }
  if (a.market.notes) lines.push(`- Notes : ${a.market.notes}`);

  lines.push("");
  lines.push("## Concurrence");
  for (const c of a.competitors) {
    lines.push(`### ${c.name} _(${c.type})_`);
    lines.push(`- Positionnement : ${c.positioning}`);
    if (c.pricing) lines.push(`- Prix : ${c.pricing}`);
    if (c.strengths.length) {
      lines.push("- Forces :");
      lines.push(bullets(c.strengths).replace(/^- /gm, "  - "));
    }
    if (c.weaknesses.length) {
      lines.push("- Faiblesses :");
      lines.push(bullets(c.weaknesses).replace(/^- /gm, "  - "));
    }
    lines.push(`- Différenciation possible : ${c.differentiation}`);
    lines.push("");
  }

  lines.push("## Forces");
  lines.push(bullets(a.strengths));
  lines.push("");
  lines.push("## Faiblesses");
  lines.push(bullets(a.weaknesses));
  lines.push("");
  lines.push("## Risques (résumé)");
  lines.push(bullets(a.risks));

  lines.push("");
  lines.push("## Scores de risque");
  for (const r of a.riskScores) {
    lines.push(
      `- **${r.label}** — ${r.level} (${r.score}/100)\n  - Pourquoi : ${r.why}\n  - Mitigation : ${r.mitigation}`,
    );
  }

  lines.push("");
  lines.push("## Hypothèses critiques à valider");
  lines.push(bullets(a.assumptions));

  lines.push("");
  lines.push("## Conseils actionnables");
  lines.push(bullets(a.advice));

  lines.push("");
  lines.push("## Client idéal (ICP)");
  lines.push(`- Acheteur : ${a.idealCustomer.buyer}`);
  if (a.idealCustomer.endUser)
    lines.push(`- Utilisateur final : ${a.idealCustomer.endUser}`);
  lines.push(`- Problème : ${a.idealCustomer.problem}`);
  lines.push(`- Douleur principale : ${a.idealCustomer.pain}`);
  lines.push(
    `- Willingness to pay : ${a.idealCustomer.willingnessToPay}`,
  );
  lines.push("- Où le trouver :");
  lines.push(bullets(a.idealCustomer.whereToFind).replace(/^- /gm, "  - "));
  lines.push("- Ce qui peut le convaincre :");
  lines.push(bullets(a.idealCustomer.convincers).replace(/^- /gm, "  - "));
  lines.push("- Objections probables :");
  lines.push(bullets(a.idealCustomer.objections).replace(/^- /gm, "  - "));
  lines.push("- Signaux d'urgence :");
  lines.push(bullets(a.idealCustomer.signals).replace(/^- /gm, "  - "));
  lines.push("- Segments à prioriser :");
  lines.push(
    bullets(a.idealCustomer.prioritySegments).replace(/^- /gm, "  - "),
  );
  lines.push("- Segments à éviter au début :");
  lines.push(bullets(a.idealCustomer.avoidSegments).replace(/^- /gm, "  - "));

  lines.push("");
  lines.push("## Test de monétisation");
  lines.push(
    `Modèle recommandé : **${monetizationLabel[a.recommendedMonetization] ?? a.recommendedMonetization}**`,
  );
  lines.push("");
  for (const m of a.monetization) {
    lines.push(
      `### ${monetizationLabel[m.model] ?? m.label}${m.recommended ? " · recommandé" : ""}`,
    );
    lines.push(`- Complexité : ${m.complexity} · Compatibilité : ${m.fit}`);
    lines.push("- Avantages :");
    lines.push(bullets(m.pros).replace(/^- /gm, "  - "));
    lines.push("- Inconvénients :");
    lines.push(bullets(m.cons).replace(/^- /gm, "  - "));
    lines.push(`- Justification : ${m.rationale}`);
    lines.push("");
  }

  lines.push("## Pricing");
  lines.push(`- Fourchette réaliste : ${a.pricing.realisticRange}`);
  lines.push(`- Prix de lancement : ${a.pricing.launchPrice}`);
  lines.push(`- Pricing MVP : ${a.pricing.mvpPricing}`);
  lines.push(`- Pricing avancé : ${a.pricing.advancedPricing}`);
  lines.push(`- Justification : ${a.pricing.justification}`);
  if (a.pricing.competitorPricing.length > 0) {
    lines.push("- Benchmark concurrents :");
    for (const cp of a.pricing.competitorPricing) {
      lines.push(`  - ${cp.name} : ${cp.price}${cp.notes ? ` _(${cp.notes})_` : ""}`);
    }
  }

  lines.push("");
  lines.push("## Plan MVP");
  lines.push("- 3 features must-build :");
  lines.push(bullets(a.mvpPlan.topThree).replace(/^- /gm, "  - "));
  lines.push("- À éviter :");
  lines.push(bullets(a.mvpPlan.avoid).replace(/^- /gm, "  - "));
  lines.push("- Ne PAS construire en V1 :");
  lines.push(bullets(a.mvpPlan.doNotBuildV1).replace(/^- /gm, "  - "));
  lines.push("### Roadmap 7 jours");
  lines.push(bullets(a.mvpPlan.sevenDay));
  lines.push("### Roadmap 30 jours");
  lines.push(bullets(a.mvpPlan.thirtyDay));
  lines.push("### Roadmap 90 jours");
  lines.push(bullets(a.mvpPlan.ninetyDay));
  lines.push("### Version manuelle / no-code");
  lines.push(a.mvpPlan.manualNoCode);

  lines.push("");
  lines.push("## Plan de validation terrain");
  lines.push("### Messages LinkedIn");
  lines.push(bullets(a.validationPlan.linkedinMessages));
  lines.push("### Questions d'interview client");
  lines.push(bullets(a.validationPlan.interviewQuestions));
  lines.push("### Script d'appel découverte");
  lines.push(a.validationPlan.discoveryScript);
  lines.push("### Landing test");
  lines.push(a.validationPlan.landingTest);
  lines.push("### Offre manuelle");
  lines.push(a.validationPlan.manualOffer);
  lines.push("### Concierge MVP");
  lines.push(a.validationPlan.conciergeMVP);
  lines.push("### Métriques à suivre");
  lines.push(bullets(a.validationPlan.metrics));
  lines.push("### Signaux positifs");
  lines.push(bullets(a.validationPlan.positiveSignals));
  lines.push("### Signaux négatifs");
  lines.push(bullets(a.validationPlan.negativeSignals));
  lines.push("### Seuils de décision");
  for (const t of a.validationPlan.thresholds) {
    lines.push(`- **${t.decision}** : ${t.criterion}`);
  }

  lines.push("");
  lines.push("## Questions investisseurs");
  for (const q of a.investorQuestions) {
    lines.push(`### ${q.question}`);
    lines.push(`- Pourquoi ça compte : ${q.whyItMatters}`);
    lines.push(`- Angle suggéré : ${q.suggestedAngle}`);
    lines.push("");
  }

  lines.push("## Business Model Canvas");
  const bmc = a.businessModelCanvas;
  lines.push("### Proposition de valeur");
  lines.push(bullets(bmc.valueProposition));
  lines.push("### Segments clients");
  lines.push(bullets(bmc.customerSegments));
  lines.push("### Canaux");
  lines.push(bullets(bmc.channels));
  lines.push("### Relation client");
  lines.push(bullets(bmc.customerRelationships));
  lines.push("### Sources de revenus");
  lines.push(bullets(bmc.revenueStreams));
  lines.push("### Structure de coûts");
  lines.push(bullets(bmc.costStructure));
  lines.push("### Partenaires clés");
  lines.push(bullets(bmc.keyPartners));
  lines.push("### Activités clés");
  lines.push(bullets(bmc.keyActivities));
  lines.push("### Ressources clés");
  lines.push(bullets(bmc.keyResources));
  lines.push("### Avantages défendables");
  lines.push(bullets(bmc.defensibleAdvantages));

  lines.push("");
  lines.push("## Positionnement recommandé");
  lines.push(a.positioning);
  lines.push("");
  lines.push("## Canaux d'acquisition");
  lines.push(bullets(a.acquisitionChannels));
  lines.push("");
  lines.push("## Questions critiques à se poser");
  lines.push(bullets(a.criticalQuestions));

  lines.push("");
  lines.push("## Sources & confiance");
  if (!a.liveSearchUsed) {
    lines.push(
      "_Recherche web non active : analyse basée sur les informations fournies. Les chiffres sont des estimations ou hypothèses._",
    );
  }
  if (a.sources.length === 0) {
    lines.push("_Aucune source citée._");
  } else {
    for (const s of a.sources) {
      const tag = s.kind === "fact" ? "fait" : s.kind === "estimate" ? "estimation" : "hypothèse";
      const url = s.url ? ` — ${s.url}` : "";
      lines.push(`- _(${tag})_ ${s.title}${url}${s.note ? ` — ${s.note}` : ""}`);
    }
  }

  lines.push("");
  lines.push("## Verdict Go / No-Go");
  lines.push(`**${verdictLabel[a.goNoGo.verdict]}** — ${a.goNoGo.why}`);
  lines.push("");
  lines.push("### Conditions");
  lines.push(bullets(a.goNoGo.conditions));
  lines.push("### À valider d'abord");
  lines.push(bullets(a.goNoGo.validateFirst));
  lines.push("### Action 48h");
  lines.push(bullets(a.goNoGo.next48h));

  if (a.destruction) {
    lines.push("");
    lines.push("## Contre-analyse");
    lines.push(`> ${a.destruction.honestVerdict}`);
    lines.push("");
    lines.push("### Failles structurelles");
    lines.push(bullets(a.destruction.fatalFlaws));
    lines.push("### Objections investisseurs");
    lines.push(bullets(a.destruction.investorObjections));
    lines.push("### Hypothèses fragiles");
    lines.push(bullets(a.destruction.fragileAssumptions));
    lines.push("### Concurrents ou alternatives dangereuses");
    lines.push(bullets(a.destruction.dangerousCompetitors));
    lines.push("### Scénarios d'échec");
    lines.push(bullets(a.destruction.failureScenarios));
  }

  return lines.join("\n");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
