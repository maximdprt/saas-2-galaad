import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  info: "border-vivid-blue/30 bg-vivid-blue/[0.06] text-ink",
  success: "border-fresh-green/40 bg-mist text-ink",
  warning: "border-coral/40 bg-coral/[0.08] text-ink",
  danger: "border-danger/40 bg-danger/[0.07] text-ink",
  neutral: "border-sand bg-shell text-ink",
};

interface CalloutProps {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  tone = "neutral",
  title,
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 text-sm leading-relaxed",
        toneClasses[tone],
        className,
      )}
    >
      {title ? (
        <p className="label-uppercase mb-2 text-muted">{title}</p>
      ) : null}
      <div className="text-base leading-relaxed">{children}</div>
    </div>
  );
}
