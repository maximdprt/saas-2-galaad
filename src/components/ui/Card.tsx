import * as React from "react";
import { cn } from "@/lib/utils";

type Surface = "paper" | "shell" | "mist" | "ink";
type Elevation = "flat" | "1" | "2" | "3";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: Surface;
  elevation?: Elevation;
  bordered?: boolean;
  radius?: "md" | "lg" | "xl";
}

const surfaceClasses: Record<Surface, string> = {
  paper: "bg-paper text-ink",
  shell: "bg-shell text-ink",
  mist: "bg-mist text-ink",
  ink: "bg-ink text-paper",
};

const elevationClasses: Record<Elevation, string> = {
  flat: "",
  "1": "shadow-[var(--shadow-level-1)]",
  "2": "shadow-[var(--shadow-level-2)]",
  "3": "shadow-[var(--shadow-level-3)]",
};

const radiusClasses = {
  md: "rounded-2xl",
  lg: "rounded-[22px]",
  xl: "rounded-[28px]",
};

export function Card({
  className,
  surface = "paper",
  elevation = "1",
  bordered = true,
  radius = "lg",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        radiusClasses[radius],
        surfaceClasses[surface],
        elevationClasses[elevation],
        bordered &&
          (surface === "ink"
            ? "border border-soft-ink"
            : "border border-sand"),
        "p-6 sm:p-8",
        className,
      )}
      {...props}
    />
  );
}
