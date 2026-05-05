import { z } from "zod";
import { generateStructured } from "@/lib/ai/provider";
import { destructionReportSchema } from "@/lib/ai/schemas";
import {
  DESTROY_INSTRUCTIONS,
  buildDestroyUserMessage,
} from "@/lib/ai/prompts/destroy";
import { badRequest, errorResponse } from "@/lib/api/respond";
import type { BusinessAnalysis } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  analysis: z.object({
    id: z.string(),
    idea: z.string(),
    summary: z.string(),
    verdict: z.string(),
    viabilityScore: z.number(),
    idealCustomer: z.object({
      buyer: z.string(),
      problem: z.string(),
    }).passthrough(),
    competitors: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          positioning: z.string(),
        }).passthrough(),
      )
      .default([]),
    assumptions: z.array(z.string()).default([]),
    risks: z.array(z.string()).default([]),
    recommendedMonetization: z.string().default(""),
  }).passthrough(),
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
      parsed.error.issues[0]?.message ?? "Analyse invalide.",
    );
  }

  try {
    const destruction = await generateStructured({
      instructions: DESTROY_INSTRUCTIONS,
      user: buildDestroyUserMessage(
        parsed.data.analysis as unknown as BusinessAnalysis,
      ),
      schema: destructionReportSchema,
      temperature: 0.55,
    });
    return Response.json(destruction);
  } catch (err) {
    return errorResponse(err);
  }
}
