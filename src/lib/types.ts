export type Verdict =
  | "go"
  | "go-conditions"
  | "pivot"
  | "no-go"
  | "too-vague";

export type RiskLevel = "low" | "medium" | "high";

export type RiskKey =
  | "market"
  | "competition"
  | "acquisition"
  | "technical"
  | "financial"
  | "legal"
  | "execution";

export type AnalysisStatus =
  | "draft"
  | "completed"
  | "needs-clarification"
  | "archived";

export type SourceKind = "fact" | "estimate" | "assumption";

export type ClarificationCategory =
  | "target"
  | "problem"
  | "solution"
  | "geo"
  | "budget"
  | "competition"
  | "business-model";

export interface ClarificationQuestion {
  id: string;
  category: ClarificationCategory;
  label: string;
  hint?: string;
}

export interface ClarificationCheck {
  needsClarification: boolean;
  vaguenessReason?: string;
  questions: ClarificationQuestion[];
}

export interface ClarificationAnswer {
  questionId: string;
  answer: string;
}

export interface RiskScore {
  key: RiskKey;
  label: string;
  level: RiskLevel;
  score: number;
  why: string;
  mitigation: string;
}

export interface Source {
  title: string;
  url?: string;
  origin?: string;
  date?: string;
  kind: SourceKind;
  note?: string;
}

export type CompetitorType = "direct" | "indirect" | "alternative";

export interface Competitor {
  name: string;
  type: CompetitorType;
  positioning: string;
  pricing?: string;
  strengths: string[];
  weaknesses: string[];
  differentiation: string;
}

export interface IdealCustomer {
  buyer: string;
  endUser?: string;
  problem: string;
  pain: string;
  willingnessToPay: string;
  whereToFind: string[];
  convincers: string[];
  objections: string[];
  signals: string[];
  prioritySegments: string[];
  avoidSegments: string[];
}

export type MonetizationModel =
  | "subscription"
  | "commission"
  | "freemium"
  | "usage-based"
  | "one-shot"
  | "premium-tier"
  | "service";

export interface MonetizationOption {
  model: MonetizationModel;
  label: string;
  pros: string[];
  cons: string[];
  complexity: "low" | "medium" | "high";
  fit: "low" | "medium" | "high";
  recommended: boolean;
  rationale: string;
}

export interface InvestorQuestion {
  question: string;
  whyItMatters: string;
  suggestedAngle: string;
}

export interface FieldValidationPlan {
  linkedinMessages: string[];
  interviewQuestions: string[];
  discoveryScript: string;
  landingTest: string;
  manualOffer: string;
  conciergeMVP: string;
  metrics: string[];
  positiveSignals: string[];
  negativeSignals: string[];
  thresholds: { decision: "continue" | "pivot" | "stop"; criterion: string }[];
}

export interface MVPPlan {
  topThree: string[];
  avoid: string[];
  doNotBuildV1: string[];
  sevenDay: string[];
  thirtyDay: string[];
  ninetyDay: string[];
  manualNoCode: string;
}

export interface PricingBenchmark {
  competitorPricing: { name: string; price: string; notes?: string }[];
  realisticRange: string;
  launchPrice: string;
  mvpPricing: string;
  advancedPricing: string;
  justification: string;
}

export interface BusinessModelCanvas {
  valueProposition: string[];
  customerSegments: string[];
  channels: string[];
  customerRelationships: string[];
  revenueStreams: string[];
  costStructure: string[];
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  defensibleAdvantages: string[];
}

export interface GoNoGo {
  verdict: Verdict;
  why: string;
  conditions: string[];
  validateFirst: string[];
  next48h: string[];
}

export interface DestructionReport {
  fatalFlaws: string[];
  investorObjections: string[];
  fragileAssumptions: string[];
  dangerousCompetitors: string[];
  failureScenarios: string[];
  honestVerdict: string;
}

export interface MarketSummary {
  segment: string;
  estimatedSize: string;
  growthSignals: string[];
  saturation: "low" | "medium" | "high";
  notes: string;
}

export interface BusinessAnalysis {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: AnalysisStatus;
  idea: string;
  clarifications: ClarificationAnswer[];
  summary: string;
  viabilityScore: number;
  verdict: Verdict;
  market: MarketSummary;
  competitors: Competitor[];
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  riskScores: RiskScore[];
  assumptions: string[];
  advice: string[];
  positioning: string;
  acquisitionChannels: string[];
  criticalQuestions: string[];
  idealCustomer: IdealCustomer;
  monetization: MonetizationOption[];
  recommendedMonetization: MonetizationModel;
  investorQuestions: InvestorQuestion[];
  validationPlan: FieldValidationPlan;
  mvpPlan: MVPPlan;
  pricing: PricingBenchmark;
  businessModelCanvas: BusinessModelCanvas;
  sources: Source[];
  liveSearchUsed: boolean;
  goNoGo: GoNoGo;
  destruction?: DestructionReport;
}

export type MentorRole = "user" | "assistant";

export interface MentorMessage {
  id: string;
  role: MentorRole;
  content: string;
  createdAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  recoveryHint?: string;
}
