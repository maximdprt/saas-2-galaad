"use client";

import type { BusinessAnalysis, MentorMessage } from "@/lib/types";

const ANALYSES_KEY = "bz.analyses.v1";
const MENTOR_KEY_PREFIX = "bz.mentor.v1.";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): BusinessAnalysis[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ANALYSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as BusinessAnalysis[];
  } catch {
    return [];
  }
}

function writeAll(items: BusinessAnalysis[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(items));
}

export const analysesStore = {
  list(): BusinessAnalysis[] {
    return readAll().sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },

  get(id: string): BusinessAnalysis | undefined {
    return readAll().find((a) => a.id === id);
  },

  save(analysis: BusinessAnalysis): BusinessAnalysis {
    const items = readAll();
    const idx = items.findIndex((a) => a.id === analysis.id);
    const next = { ...analysis, updatedAt: new Date().toISOString() };
    if (idx >= 0) items[idx] = next;
    else items.unshift(next);
    writeAll(items);
    return next;
  },

  update(
    id: string,
    patch: Partial<BusinessAnalysis>,
  ): BusinessAnalysis | undefined {
    const items = readAll();
    const idx = items.findIndex((a) => a.id === id);
    if (idx < 0) return undefined;
    const next: BusinessAnalysis = {
      ...items[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    items[idx] = next;
    writeAll(items);
    return next;
  },

  remove(id: string): void {
    const items = readAll().filter((a) => a.id !== id);
    writeAll(items);
    if (isBrowser()) {
      localStorage.removeItem(MENTOR_KEY_PREFIX + id);
    }
  },

  clear(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ANALYSES_KEY);
  },
};

export const mentorStore = {
  get(analysisId: string): MentorMessage[] {
    if (!isBrowser()) return [];
    try {
      const raw = localStorage.getItem(MENTOR_KEY_PREFIX + analysisId);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as MentorMessage[]) : [];
    } catch {
      return [];
    }
  },

  set(analysisId: string, messages: MentorMessage[]): void {
    if (!isBrowser()) return;
    localStorage.setItem(
      MENTOR_KEY_PREFIX + analysisId,
      JSON.stringify(messages),
    );
  },

  clear(analysisId: string): void {
    if (!isBrowser()) return;
    localStorage.removeItem(MENTOR_KEY_PREFIX + analysisId);
  },
};
