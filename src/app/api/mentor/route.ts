import { z } from "zod";
import { chatPlainText } from "@/lib/ai/provider";
import {
  buildMentorSystemPrompt,
  mentorMessagesToProvider,
} from "@/lib/ai/prompts/mentor";
import { badRequest, errorResponse } from "@/lib/api/respond";
import type { BusinessAnalysis } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  analysis: z.unknown(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      createdAt: z.string(),
    }),
  ),
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
    return badRequest("Requête mentor invalide.");
  }

  try {
    const analysis = parsed.data.analysis as BusinessAnalysis;
    const reply = await chatPlainText({
      system: buildMentorSystemPrompt(analysis),
      messages: mentorMessagesToProvider(parsed.data.messages),
      temperature: 0.55,
    });
    return Response.json({ content: reply });
  } catch (err) {
    return errorResponse(err);
  }
}
