import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { id: string; label: string }[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-3", className)}>
      {steps.map((s, i) => {
        const status =
          i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={s.id} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
                status === "active" &&
                  "border-olive bg-olive text-paper",
                status === "done" &&
                  "border-olive bg-mist text-olive",
                status === "todo" &&
                  "border-sand bg-paper text-muted",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                status === "active" ? "text-ink" : "text-muted",
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 ? (
              <span className="hidden h-px w-8 bg-sand sm:inline-block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
