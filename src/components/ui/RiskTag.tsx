import { Tag } from "./Tag";
import type { RiskLevel } from "@/lib/types";

const map: Record<RiskLevel, { label: string; tone: "success" | "gold" | "danger" }> =
  {
    low: { label: "Risque faible", tone: "success" },
    medium: { label: "Risque moyen", tone: "gold" },
    high: { label: "Risque élevé", tone: "danger" },
  };

export function RiskTag({ level }: { level: RiskLevel }) {
  const m = map[level];
  return <Tag tone={m.tone}>{m.label}</Tag>;
}
