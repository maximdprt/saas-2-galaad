import type {
  BusinessAnalysis,
  ClarificationAnswer,
} from "@/lib/types";
import type { BusinessAnalysisCore } from "@/lib/ai/schemas";
import { uid } from "@/lib/utils";

export function buildAnalysisFromCore(args: {
  idea: string;
  clarifications: ClarificationAnswer[];
  core: BusinessAnalysisCore;
  liveSearchUsed: boolean;
}): BusinessAnalysis {
  const now = new Date().toISOString();
  return {
    id: uid("an"),
    createdAt: now,
    updatedAt: now,
    status: args.core.verdict === "too-vague" ? "needs-clarification" : "completed",
    idea: args.idea,
    clarifications: args.clarifications,
    liveSearchUsed: args.liveSearchUsed,
    ...args.core,
  };
}
