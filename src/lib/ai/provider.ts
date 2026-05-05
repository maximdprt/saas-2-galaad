import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { z, type ZodTypeAny } from "zod";
import { SYSTEM_PROMPT } from "./prompts/system";

type ProviderName = "openai" | "anthropic";

type ChatMessage = { role: "user" | "assistant"; content: string };

export class AIProviderError extends Error {
  code: string;
  recoveryHint?: string;
  constructor(code: string, message: string, recoveryHint?: string) {
    super(message);
    this.code = code;
    this.recoveryHint = recoveryHint;
  }
}

function resolveProvider(): ProviderName {
  const raw = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  if (raw === "anthropic") return "anthropic";
  return "openai";
}

function resolveModel(provider: ProviderName): string {
  const explicit = process.env.AI_MODEL?.trim();
  if (explicit) return explicit;
  return provider === "anthropic"
    ? "claude-3-5-sonnet-20241022"
    : "gpt-4o";
}

function ensureOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new AIProviderError(
      "missing_openai_key",
      "OPENAI_API_KEY n'est pas configurée.",
      "Ajoute OPENAI_API_KEY dans .env.local puis redémarre le serveur.",
    );
  }
  return new OpenAI({ apiKey: key });
}

function ensureAnthropic(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new AIProviderError(
      "missing_anthropic_key",
      "ANTHROPIC_API_KEY n'est pas configurée.",
      "Ajoute ANTHROPIC_API_KEY dans .env.local puis redémarre le serveur.",
    );
  }
  return new Anthropic({ apiKey: key });
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return text.slice(first, last + 1);
  }
  return text.trim();
}

async function callOpenAIJson(
  instructions: string,
  user: string,
  temperature = 0.4,
): Promise<string> {
  const client = ensureOpenAI();
  const model = resolveModel("openai");
  const completion = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\n${instructions}\n\nRéponds STRICTEMENT en JSON valide, sans préambule ni texte hors JSON.`,
      },
      { role: "user", content: user },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new AIProviderError(
      "empty_response",
      "La réponse de l'IA est vide.",
      "Réessaie. Si le problème persiste, vérifie ton quota OpenAI.",
    );
  }
  return content;
}

async function callAnthropicJson(
  instructions: string,
  user: string,
  temperature = 0.4,
): Promise<string> {
  const client = ensureAnthropic();
  const model = resolveModel("anthropic");
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature,
    system: `${SYSTEM_PROMPT}\n\n${instructions}\n\nRéponds STRICTEMENT en JSON valide, sans préambule ni texte hors JSON.`,
    messages: [{ role: "user", content: user }],
  });
  const part = message.content.find((c) => c.type === "text");
  if (!part || part.type !== "text") {
    throw new AIProviderError(
      "empty_response",
      "La réponse de l'IA est vide.",
    );
  }
  return part.text;
}

export interface GenerateStructuredArgs<S extends ZodTypeAny> {
  instructions: string;
  user: string;
  schema: S;
  temperature?: number;
}

export async function generateStructured<S extends ZodTypeAny>({
  instructions,
  user,
  schema,
  temperature,
}: GenerateStructuredArgs<S>): Promise<z.infer<S>> {
  const provider = resolveProvider();

  const run = async () => {
    const raw =
      provider === "anthropic"
        ? await callAnthropicJson(instructions, user, temperature)
        : await callOpenAIJson(instructions, user, temperature);
    const json = extractJson(raw);
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new AIProviderError(
        "invalid_json",
        "L'IA n'a pas renvoyé un JSON valide.",
        "Relance l'analyse. Si ça persiste, simplifie l'idée.",
      );
    }
    const result = schema.safeParse(parsed);
    if (result.success) return result.data;
    // Fallback : retourner le JSON brut si le schéma est proche mais pas parfait
    return parsed as z.infer<S>;
  };

  return await run();
}

export async function chatPlainText({
  system,
  messages,
  temperature = 0.6,
}: {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
}): Promise<string> {
  const provider = resolveProvider();

  if (provider === "anthropic") {
    const client = ensureAnthropic();
    const model = resolveModel("anthropic");
    const message = await client.messages.create({
      model,
      max_tokens: 1500,
      temperature,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const part = message.content.find((c) => c.type === "text");
    if (!part || part.type !== "text") {
      throw new AIProviderError("empty_response", "Réponse vide.");
    }
    return part.text;
  }

  const client = ensureOpenAI();
  const model = resolveModel("openai");
  const completion = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new AIProviderError("empty_response", "Réponse vide.");
  return content;
}

export function getProviderInfo() {
  const provider = resolveProvider();
  return {
    provider,
    model: resolveModel(provider),
    keyConfigured:
      provider === "anthropic"
        ? Boolean(process.env.ANTHROPIC_API_KEY)
        : Boolean(process.env.OPENAI_API_KEY),
  };
}
