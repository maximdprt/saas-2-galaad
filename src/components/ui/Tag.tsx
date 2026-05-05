import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "info"
  | "success"
  | "gold"
  | "warning"
  | "danger"
  | "ink";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-shell text-ink border-sand",
  info: "bg-vivid-blue/[0.08] text-vivid-blue border-vivid-blue/30",
  success: "bg-mist text-olive border-olive/30",
  gold: "bg-gold/[0.12] text-ink border-gold/40",
  warning: "bg-coral/[0.12] text-ink border-coral/40",
  danger: "bg-danger/[0.10] text-danger border-danger/30",
  ink: "bg-ink text-paper border-soft-ink",
};

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: "sm" | "md";
}

export function Tag({
  tone = "neutral",
  size = "sm",
  className,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
