import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps {
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function FieldLabel({ htmlFor, hint, className, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("flex flex-col gap-1.5 text-sm", className)}
    >
      <span className="font-medium text-ink">{children}</span>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const baseInputClasses = cn(
  "w-full rounded-2xl border border-sand bg-paper px-4 py-3 text-base text-ink",
  "placeholder:text-muted-light",
  "focus:border-vivid-blue/60 focus:outline-none focus:ring-2 focus:ring-vivid-blue/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "transition-colors duration-200",
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(baseInputClasses, className)}
        {...props}
      />
    );
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 6, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(baseInputClasses, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
});
