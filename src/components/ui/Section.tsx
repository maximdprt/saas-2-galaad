import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  contained?: boolean;
}

export function Section({
  className,
  contained = true,
  id,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(contained && "scroll-mt-24", className)}
      {...props}
    />
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-x-8 gap-y-3",
        align === "center" && "justify-center text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-w-2xl flex-col gap-2",
          align === "center" && "mx-auto items-center",
        )}
      >
        {eyebrow ? (
          <span className="label-uppercase text-muted">{eyebrow}</span>
        ) : null}
        <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="ml-auto flex gap-2">{actions}</div> : null}
    </div>
  );
}
