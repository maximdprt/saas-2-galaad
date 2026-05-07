import { z } from "zod";
import { generateStructured } from "@/lib/ai/provider";
import { businessAnalysisCoreSchema } from "@/lib/ai/schemas";
import {
  ANALYZE_INSTRUCTIONS,
  ANALYZE_SCHEMA_NOTES,
  buildAnalyzeUserMessage,
} from "@/lib/ai/prompts/analyze";
import { badRequest, errorResponse } from "@/lib/api/respond";
import { isWebSearchAvailable } from "@/lib/search/provider";
import { buildAnalysisFromCore } from "@/lib/analysis/build";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 300;

const bodySchema = z.object({
  idea: z.string().min(3).max(4000),
  clarifications: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string().max(2000),
      }),
    )
    .default([]),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON invalide.");
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(
      parsed.error.issues[0]?.message ?? "Requête invalide.",
      "Vérifie le contenu envoyé.",
    );
  }

  const liveSearch = isWebSearchAvailable();

  try {
    const core = await generateStructured({
      instructions: `${ANALYZE_INSTRUCTIONS}\n\n${ANALYZE_SCHEMA_NOTES}`,
      user: buildAnalyzeUserMessage(
        parsed.data.idea,
        parsed.data.clarifications,
        liveSearch,
      ),
      schema: businessAnalysisCoreSchema,
      temperature: 0.45,
    });

    // Save to Supabase when configured. Local browser storage remains the
    // primary persistence path for the app.
    const analysis = buildAnalysisFromCore({
      idea: parsed.data.idea,
      clarifications: parsed.data.clarifications,
      core,
      liveSearchUsed: liveSearch,
    });
    getSupabase()
      ?.from("analyses")
      .insert({
        id: analysis.id,
        created_at: analysis.createdAt,
        idea: analysis.idea,
        verdict: analysis.verdict,
        viability_score: analysis.viabilityScore,
        summary: analysis.summary,
        report: analysis,
      })
      .then(({ error }) => {
        if (error) console.error("[Supabase] insert failed:", error.message);
      });

    return Response.json({ core, liveSearchUsed: liveSearch });
  } catch (err) {
    return errorResponse(err);
  }
}
