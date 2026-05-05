import { z } from "zod";
import { generateStructured } from "@/lib/ai/provider";
import { clarificationCheckSchema } from "@/lib/ai/schemas";
import {
  CLARIFY_INSTRUCTIONS,
  buildClarifyUserMessage,
} from "@/lib/ai/prompts/clarify";
import { badRequest, errorResponse } from "@/lib/api/respond";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  idea: z.string().min(3, "Idée trop courte").max(4000, "Idée trop longue"),
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

  try {
    const result = await generateStructured({
      instructions: CLARIFY_INSTRUCTIONS,
      user: buildClarifyUserMessage(parsed.data.idea),
      schema: clarificationCheckSchema,
      temperature: 0.2,
    });
    return Response.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
