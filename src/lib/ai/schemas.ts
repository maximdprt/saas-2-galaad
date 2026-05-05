import { z } from "zod";

export const verdictSchema = z.enum([
  "go",
  "go-conditions",
  "pivot",
  "no-go",
  "too-vague",
]);

export const riskLevelSchema = z.preprocess((v) => {
  const raw = normalizeLooseText(v);
  if (typeof raw !== "string") return raw;
  if (
    raw === "low" ||
    raw.includes("faible") ||
    raw.includes("bas") ||
    raw.includes("simple")
  ) {
    return "low";
  }
  if (
    raw === "medium" ||
    raw === "moderate" ||
    raw.includes("moyen") ||
    raw.includes("modere")
  ) {
    return "medium";
  }
  if (
    raw === "high" ||
    raw.includes("eleve") ||
    raw.includes("haut") ||
    raw.includes("fort") ||
    raw.includes("complexe")
  ) {
    return "high";
  }
  return raw;
}, z.enum(["low", "medium", "high"]));

export const riskKeySchema = z.preprocess((v) => {
  const raw = normalizeLooseText(v);
  if (typeof raw !== "string") return raw;

  if (raw === "market" || raw.includes("market") || raw.includes("marche")) {
    return "market";
  }
  if (
    raw === "competition" ||
    raw.includes("concurrence") ||
    raw.includes("concurrentiel") ||
    raw.includes("competitor") ||
    raw.includes("competitive")
  ) {
    return "competition";
  }
  if (
    raw === "acquisition" ||
    raw.includes("acquisition") ||
    raw.includes("client") ||
    raw.includes("marketing")
  ) {
    return "acquisition";
  }
  if (
    raw === "technical" ||
    raw.includes("technique") ||
    raw.includes("technologique") ||
    raw.includes("tech")
  ) {
    return "technical";
  }
  if (
    raw === "financial" ||
    raw.includes("financier") ||
    raw.includes("finance") ||
    raw.includes("money") ||
    raw.includes("monetisation") ||
    raw.includes("pricing")
  ) {
    return "financial";
  }
  if (
    raw === "legal" ||
    raw.includes("legal") ||
    raw.includes("reglementaire") ||
    raw.includes("juridique") ||
    raw.includes("compliance")
  ) {
    return "legal";
  }
  if (
    raw === "execution" ||
    raw.includes("execution") ||
    raw.includes("operation") ||
    raw.includes("equipe") ||
    raw.includes("go to market")
  ) {
    return "execution";
  }

  return raw;
}, z.enum([
  "market",
  "competition",
  "acquisition",
  "technical",
  "financial",
  "legal",
  "execution",
]));

export const sourceKindSchema = z.preprocess((v) => {
  const raw = normalizeLooseText(v);
  if (typeof raw !== "string") return raw;
  if (raw.includes("fait") || raw.includes("fact")) return "fact";
  if (raw.includes("estim")) return "estimate";
  if (raw.includes("hypoth") || raw.includes("assumption")) return "assumption";
  return raw;
}, z.enum(["fact", "estimate", "assumption"]));

export const clarificationCategorySchema = z.enum([
  "target",
  "problem",
  "solution",
  "geo",
  "budget",
  "competition",
  "business-model",
]);

export const clarificationQuestionSchema = z.object({
  id: z.string(),
  category: clarificationCategorySchema,
  label: z.string(),
  hint: z.string().optional(),
});

export const clarificationCheckSchema = z.object({
  needsClarification: z.boolean(),
  vaguenessReason: z.string().optional(),
  questions: z.array(clarificationQuestionSchema),
});

export const riskScoreSchema = z.object({
  key: riskKeySchema,
  label: z.string(),
  level: riskLevelSchema,
  score: z.number().min(0).max(100),
  why: z.string(),
  mitigation: z.string(),
});

export const sourceSchema = z.object({
  title: z.preprocess((v) => (v == null || v === "" ? "Source" : v), z.string()),
  url: z.string().optional(),
  origin: z.string().optional(),
  date: z.string().optional(),
  kind: sourceKindSchema,
  note: z.string().optional(),
});

function normalizeLooseText(value: unknown) {
  if (typeof value !== "string") return value;
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function splitListText(value: string) {
  return value
    .split(/\n|,|;|•|- /g)
    .map((s) => s.trim())
    .filter(Boolean);
}

const stringListSchema = z.preprocess((v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return splitListText(v);
  if (v == null) return [];
  return [String(v)];
}, z.array(z.coerce.string()).default([]));

const competitorTypeSchema = z.preprocess((v) => {
  const raw = normalizeLooseText(v);
  if (typeof raw !== "string") return raw;
  if (raw.includes("direct")) return "direct";
  if (raw.includes("indirect")) return "indirect";
  if (
    raw.includes("alternative") ||
    raw.includes("alternatif") ||
    raw.includes("substitut") ||
    raw.includes("remplacement") ||
    raw.includes("existing solution")
  ) {
    return "alternative";
  }
  return raw;
}, z.enum(["direct", "indirect", "alternative"]));

export const competitorSchema = z.preprocess((v) => {
  if (typeof v === "string") {
    return {
      name: v,
      type: "alternative",
      positioning: "Concurrent ou alternative mentionnée par l'IA.",
      pricing: "Non disponible",
      strengths: [],
      weaknesses: [],
      differentiation: "À préciser avec une recherche concurrentielle dédiée.",
    };
  }
  return v;
}, z.object({
  name: z.string(),
  type: competitorTypeSchema.default("alternative"),
  positioning: z.string().default("Positionnement à préciser."),
  pricing: z.string().optional(),
  strengths: stringListSchema,
  weaknesses: stringListSchema,
  differentiation: z
    .string()
    .default("Différenciation à préciser après analyse plus fine."),
}));

export const idealCustomerSchema = z.object({
  buyer: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Non précisé (à clarifier)")),
  endUser: z.string().optional(),
  problem: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim().length > 0 ? v : "Problème non précisé (à clarifier)",
    ),
  pain: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim().length > 0 ? v : "Douleur non précisée (à clarifier)",
    ),
  willingnessToPay: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Non précisé (à estimer)")),
  whereToFind: stringListSchema,
  convincers: stringListSchema,
  objections: stringListSchema,
  signals: stringListSchema,
  prioritySegments: stringListSchema,
  avoidSegments: stringListSchema,
});

export const monetizationModelSchema = z.preprocess((v) => {
  const s = typeof v === "string" ? v.toLowerCase().trim() : v;
  const map: Record<string, string> = {
    "subscription": "subscription",
    "abonnement": "subscription",
    "saas": "subscription",
    "commission": "commission",
    "marketplace": "commission",
    "freemium": "freemium",
    "usage-based": "usage-based",
    "pay-per-use": "usage-based",
    "metered": "usage-based",
    "one-shot": "one-shot",
    "one_shot": "one-shot",
    "oneshot": "one-shot",
    "license": "one-shot",
    "licensing": "one-shot",
    "perpetual": "one-shot",
    "premium-tier": "premium-tier",
    "premium_tier": "premium-tier",
    "tiered": "premium-tier",
    "service": "service",
    "consulting": "service",
    "professional-services": "service",
  };
  return map[s as string] ?? "service";
}, z.enum([
  "subscription",
  "commission",
  "freemium",
  "usage-based",
  "one-shot",
  "premium-tier",
  "service",
]));

export const monetizationOptionSchema = z.object({
  model: monetizationModelSchema,
  label: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Option")),
  pros: stringListSchema,
  cons: stringListSchema,
  complexity: z.preprocess((v) => {
    const raw = normalizeLooseText(v);
    if (typeof raw !== "string") return raw;
    if (raw.includes("faible") || raw.includes("low")) return "low";
    if (
      raw.includes("moyen") ||
      raw.includes("modere") ||
      raw.includes("modéré") ||
      raw.includes("medium")
    )
      return "medium";
    if (raw.includes("eleve") || raw.includes("élevé") || raw.includes("high"))
      return "high";
    return raw;
  }, riskLevelSchema),
  fit: z.preprocess((v) => {
    const raw = normalizeLooseText(v);
    if (typeof raw !== "string") return raw;
    if (raw.includes("faible") || raw.includes("low")) return "low";
    if (
      raw.includes("moyen") ||
      raw.includes("modere") ||
      raw.includes("modéré") ||
      raw.includes("medium")
    )
      return "medium";
    if (raw.includes("eleve") || raw.includes("élevé") || raw.includes("high"))
      return "high";
    return raw;
  }, riskLevelSchema),
  recommended: z.boolean(),
  rationale: z.string(),
});

export const investorQuestionSchema = z.object({
  question: z.string(),
  whyItMatters: z.string(),
  suggestedAngle: z.string(),
});

export const validationPlanSchema = z.object({
  linkedinMessages: stringListSchema,
  interviewQuestions: stringListSchema,
  discoveryScript: z.string(),
  landingTest: z.string(),
  manualOffer: z.string(),
  conciergeMVP: z.string(),
  metrics: stringListSchema,
  positiveSignals: stringListSchema,
  negativeSignals: stringListSchema,
  thresholds: z.preprocess(
    (v) => {
      const arr = Array.isArray(v) ? v : v && typeof v === "object" ? Object.values(v) : [];
      return arr.map((item: unknown) => {
        if (item && typeof item === "object") return item;
        const s = String(item);
        const lower = s.toLowerCase();
        const decision = lower.includes("stop") ? "stop" : lower.includes("pivot") ? "pivot" : "continue";
        return { decision, criterion: s };
      });
    },
    z.array(
      z.object({
        decision: z.enum(["continue", "pivot", "stop"]),
        criterion: z.string(),
      }),
    ),
  ),
});

export const mvpPlanSchema = z.object({
  topThree: stringListSchema,
  avoid: stringListSchema,
  doNotBuildV1: stringListSchema,
  sevenDay: stringListSchema,
  thirtyDay: stringListSchema,
  ninetyDay: stringListSchema,
  manualNoCode: z.string(),
});

export const pricingBenchmarkSchema = z.object({
  competitorPricing: z.preprocess(
    (v) => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        try { return JSON.parse(v); } catch { return []; }
      }
      if (v && typeof v === "object") return Object.values(v);
      return [];
    },
    z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        notes: z.string().optional(),
      }),
    ),
  ),
  realisticRange: z.string(),
  launchPrice: z.string(),
  mvpPricing: z.string(),
  advancedPricing: z.string(),
  justification: z.string(),
});

export const businessModelCanvasSchema = z.object({
  valueProposition: stringListSchema,
  customerSegments: stringListSchema,
  channels: stringListSchema,
  customerRelationships: stringListSchema,
  revenueStreams: stringListSchema,
  costStructure: stringListSchema,
  keyPartners: stringListSchema,
  keyActivities: stringListSchema,
  keyResources: stringListSchema,
  defensibleAdvantages: stringListSchema,
});

export const goNoGoSchema = z.object({
  verdict: verdictSchema,
  why: z.string(),
  conditions: stringListSchema,
  validateFirst: stringListSchema,
  next48h: stringListSchema,
});

export const destructionReportSchema = z.object({
  fatalFlaws: stringListSchema,
  investorObjections: stringListSchema,
  fragileAssumptions: stringListSchema,
  dangerousCompetitors: stringListSchema,
  failureScenarios: stringListSchema,
  honestVerdict: z.string(),
});

const saturationSchema = z.preprocess((v) => {
  const raw = normalizeLooseText(v);
  if (typeof raw !== "string") return raw;
  if (
    raw === "low" ||
    raw.includes("faible") ||
    raw.includes("bas") ||
    raw.includes("peu sature") ||
    raw.includes("non sature")
  ) {
    return "low";
  }
  if (
    raw === "medium" ||
    raw === "moderate" ||
    raw.includes("moyen") ||
    raw.includes("modere") ||
    raw.includes("raisonnable")
  ) {
    return "medium";
  }
  if (
    raw === "high" ||
    raw.includes("eleve") ||
    raw.includes("haut") ||
    raw.includes("fort") ||
    raw.includes("sature") ||
    raw.includes("tres concurrentiel")
  ) {
    return "high";
  }
  return raw;
}, z.enum(["low", "medium", "high"]));

const growthSignalsSchema = z.preprocess((v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    // Supporte une chaîne multi-lignes / séparée par virgules.
    const parts = v
      .split(/\n|,|;|•|- /g)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts;
  }
  return [];
}, z.array(z.string()).default([]));

const competitorsSchema = z.preprocess((v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return splitListText(v);
  return [];
}, z.array(competitorSchema).default([]));

export const marketSummarySchema = z.object({
  segment: z.string(),
  estimatedSize: z
    .string()
    .optional()
    .transform((v) => v ?? "Estimation non disponible (à valider)"),
  growthSignals: growthSignalsSchema,
  saturation: saturationSchema,
  notes: z.string().default(""),
});

export const businessAnalysisCoreSchema = z.object({
  summary: z.string(),
  viabilityScore: z.number().min(0).max(100),
  verdict: verdictSchema,
  market: marketSummarySchema,
  competitors: competitorsSchema,
  strengths: stringListSchema,
  weaknesses: stringListSchema,
  risks: stringListSchema,
  riskScores: z.array(riskScoreSchema),
  assumptions: stringListSchema,
  advice: stringListSchema,
  positioning: z.string(),
  acquisitionChannels: stringListSchema,
  criticalQuestions: stringListSchema,
  idealCustomer: idealCustomerSchema,
  monetization: z.array(monetizationOptionSchema),
  recommendedMonetization: monetizationModelSchema,
  investorQuestions: z.array(investorQuestionSchema),
  validationPlan: validationPlanSchema,
  mvpPlan: mvpPlanSchema,
  pricing: pricingBenchmarkSchema,
  businessModelCanvas: businessModelCanvasSchema,
  sources: z.array(sourceSchema),
  goNoGo: goNoGoSchema,
});

export type BusinessAnalysisCore = z.infer<typeof businessAnalysisCoreSchema>;
export type ClarificationCheckSchema = z.infer<typeof clarificationCheckSchema>;
export type DestructionReportSchema = z.infer<typeof destructionReportSchema>;
