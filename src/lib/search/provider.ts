import type { Source } from "@/lib/types";

export interface WebSearchResult {
  ok: boolean;
  reason?: string;
  sources: Source[];
}

export function isWebSearchAvailable(): boolean {
  return Boolean(process.env.WEB_SEARCH_API_KEY?.trim());
}

/**
 * Stub web-search provider.
 *
 * Drop-in point for a real provider (Tavily, Exa, Brave Search, Perplexity…).
 * As long as `WEB_SEARCH_API_KEY` is unset, we return `{ ok: false }` so the
 * report layer can show a calm "no live search" notice instead of inventing
 * sources.
 */
export async function webSearch(query: string): Promise<WebSearchResult> {
  void query;
  if (!isWebSearchAvailable()) {
    return {
      ok: false,
      reason: "WEB_SEARCH_API_KEY non configurée",
      sources: [],
    };
  }
  return {
    ok: false,
    reason:
      "Aucun adaptateur de recherche n'est branché. Implémente un provider dans src/lib/search/provider.ts.",
    sources: [],
  };
}
