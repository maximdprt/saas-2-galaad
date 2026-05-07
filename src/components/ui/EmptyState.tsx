import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg border border-dashed border-sand bg-shell p-6",
        className,
      )}
    >
      <p className="text-2xl font-bold uppercase leading-tight">{title}</p>
      {description ? (
        <p className="max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
}
