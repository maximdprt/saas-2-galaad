import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

type Tone = "good" | "neutral" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  good: "text-olive",
  info: "text-vivid-blue",
  neutral: "text-ink",
  warning: "text-coral",
  danger: "text-danger",
};

const trackClasses: Record<Tone, string> = {
  good: "bg-olive",
  info: "bg-vivid-blue",
  neutral: "bg-soft-ink",
  warning: "bg-coral",
  danger: "bg-danger",
};

interface ScoreCardProps {
  label: string;
  value: number;
  description?: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
  footer?: React.ReactNode;
}

export function ScoreCard({
  label,
  value,
  description,
  tone = "neutral",
  size = "md",
  className,
  footer,
}: ScoreCardProps) {
  const num = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <Card
      surface="paper"
      elevation="1"
      radius={size === "lg" ? "xl" : "lg"}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="label-uppercase text-muted">{label}</p>
        <span className="text-xs text-muted">/100</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "tabular-nums font-semibold leading-none",
            size === "lg"
              ? "text-6xl sm:text-7xl"
              : size === "sm"
                ? "text-3xl"
                : "text-5xl",
            toneClasses[tone],
          )}
        >
          {num}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-mist">
        <div
          className={cn("h-full rounded-full", trackClasses[tone])}
          style={{ width: `${num}%` }}
        />
      </div>
      {description ? (
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {footer}
    </Card>
  );
}

export function scoreToTone(score: number): Tone {
  if (score >= 70) return "good";
  if (score >= 50) return "info";
  if (score >= 35) return "warning";
  return "danger";
}

export function riskScoreToTone(score: number): Tone {
  if (score <= 30) return "good";
  if (score <= 55) return "warning";
  return "danger";
}
