import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { Mistral } from "@mistralai/mistralai";
import { z, type ZodTypeAny } from "zod";
import { SYSTEM_PROMPT } from "./prompts/system";

type ProviderName = "openai" | "anthropic" | "mistral" | "xai";

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
  if (raw === "mistral" || raw === "mistralai") return "mistral";
  if (raw === "xai" || raw === "grok") return "xai";
  return "openai";
}

function resolveModel(provider: ProviderName): string {
  const explicit = process.env.AI_MODEL?.trim();
  if (explicit) return explicit;
  return provider === "anthropic"
    ? "claude-3-5-sonnet-20241022"
    : provider === "mistral"
      ? "mistral-large-latest"
      : provider === "xai"
        ? "grok-3-mini"
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

function ensureMistral(): Mistral {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) {
    throw new AIProviderError(
      "missing_mistral_key",
      "MISTRAL_API_KEY n'est pas configurée.",
      "Ajoute MISTRAL_API_KEY dans .env.local puis redémarre le serveur.",
    );
  }
  const timeoutMsRaw = process.env.MISTRAL_TIMEOUT_MS?.trim();
  const timeoutMs = timeoutMsRaw ? Number(timeoutMsRaw) : 20_000;
  return new Mistral({
    apiKey: key,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 20_000,
  });
}

function ensureXai(): OpenAI {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    throw new AIProviderError(
      "missing_xai_key",
      "XAI_API_KEY n'est pas configurée.",
      "Ajoute XAI_API_KEY dans .env.local puis redémarre le serveur.",
    );
  }
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.x.ai/v1",
  });
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

async function callMistralJson(
  instructions: string,
  user: string,
  temperature = 0.4,
): Promise<string> {
  const client = ensureMistral();
  const model = resolveModel("mistral");
  let completion: unknown;
  try {
    completion = await client.chat.complete({
      model,
      temperature,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${instructions}\n\nRéponds STRICTEMENT en JSON valide, sans préambule ni texte hors JSON.`,
        },
        { role: "user", content: user },
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    throw new AIProviderError(
      "mistral_request_failed",
      `Mistral: requête échouée (${message})`,
      "Vérifie ta clé Mistral, ta connexion réseau, puis réessaie.",
    );
  }
  const content =
    // SDK returns either a string or content parts depending on model/version.
    ((completion as any).choices?.[0]?.message as any)?.content ??
    ((completion as any).choices?.[0]?.message as any)?.content?.[0]?.text;

  const text = Array.isArray(content)
    ? content.map((c: any) => c?.text ?? "").join("")
    : typeof content === "string"
      ? content
      : typeof content?.text === "string"
        ? content.text
        : "";

  if (!text) {
    throw new AIProviderError(
      "empty_response",
      "La réponse de l'IA est vide.",
      "Réessaie. Si le problème persiste, vérifie ton quota Mistral.",
    );
  }
  return text;
}

async function callXaiJson(
  instructions: string,
  user: string,
  temperature = 0.4,
): Promise<string> {
  const client = ensureXai();
  const model = resolveModel("xai");
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
      "Réessaie. Si le problème persiste, vérifie ton quota xAI.",
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
        : provider === "mistral"
          ? await callMistralJson(instructions, user, temperature)
          : provider === "xai"
            ? await callXaiJson(instructions, user, temperature)
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

  if (provider === "mistral") {
    const client = ensureMistral();
    const model = resolveModel("mistral");
    const completion = await client.chat.complete({
      model,
      temperature,
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    const content =
      (completion.choices?.[0]?.message as any)?.content ??
      (completion.choices?.[0]?.message as any)?.content?.[0]?.text;
    const text = Array.isArray(content)
      ? content.map((c: any) => c?.text ?? "").join("")
      : typeof content === "string"
        ? content
        : typeof content?.text === "string"
          ? content.text
          : "";
    if (!text) throw new AIProviderError("empty_response", "Réponse vide.");
    return text;
  }

  if (provider === "xai") {
    const client = ensureXai();
    const model = resolveModel("xai");
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
        : provider === "mistral"
          ? Boolean(process.env.MISTRAL_API_KEY)
          : provider === "xai"
            ? Boolean(process.env.XAI_API_KEY)
        : Boolean(process.env.OPENAI_API_KEY),
  };
}
