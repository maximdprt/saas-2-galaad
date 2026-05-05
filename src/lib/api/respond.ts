import { AIProviderError } from "@/lib/ai/provider";
import type { ApiError } from "@/lib/types";

export function errorResponse(err: unknown, status = 500): Response {
  const payload: ApiError =
    err instanceof AIProviderError
      ? {
          code: err.code,
          message: err.message,
          recoveryHint: err.recoveryHint,
        }
      : err instanceof Error
        ? { code: "internal_error", message: err.message }
        : { code: "internal_error", message: "Erreur inconnue côté serveur." };
  return Response.json({ error: payload }, { status });
}

export function badRequest(message: string, recoveryHint?: string): Response {
  return Response.json(
    { error: { code: "bad_request", message, recoveryHint } satisfies ApiError },
    { status: 400 },
  );
}
