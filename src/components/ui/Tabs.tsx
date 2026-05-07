"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-md border border-sand bg-paper p-1 shadow-[var(--shadow-level-1)]",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          onClick={() => onChange(t.id)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-semibold transition-colors",
            t.id === active
              ? "bg-ink text-paper"
              : "text-muted hover:bg-mist hover:text-ink",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
