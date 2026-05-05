"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AnchorItem {
  id: string;
  label: string;
}

interface SectionAnchorsProps {
  items: AnchorItem[];
  className?: string;
}

export function SectionAnchors({ items, className }: SectionAnchorsProps) {
  const [active, setActive] = React.useState<string>(items[0]?.id ?? "");

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.5, 1] },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Sections du rapport"
      className={cn(
        "rounded-2xl border border-sand bg-paper p-4 text-sm shadow-[var(--shadow-level-1)]",
        className,
      )}
    >
      <p className="label-uppercase mb-3 text-muted">Sommaire</p>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                active === it.id
                  ? "bg-mist text-ink font-medium"
                  : "text-muted hover:bg-mist/60 hover:text-ink",
              )}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
