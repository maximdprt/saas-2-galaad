import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "blue" | "gold" | "secondary" | "ghost";
type Size = "md" | "sm" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-2",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-5 py-2.5 text-lg gap-3",
};

const iconSizeClasses: Record<Size, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-9 w-9",
};

function variantClasses(variant: Variant): string {
  switch (variant) {
    case "primary":
      return cn(
        "border border-ink bg-ink text-paper shadow-[var(--shadow-level-1)]",
        "before:bg-gold hover:text-ink",
      );
    case "blue":
      return cn(
        "border border-ink bg-paper text-ink shadow-[var(--shadow-level-1)]",
        "before:bg-vivid-blue hover:text-paper",
      );
    case "gold":
      return cn(
        "border border-ink bg-gold text-ink shadow-[var(--shadow-level-1)]",
        "before:bg-gold hover:text-ink",
      );
    case "secondary":
      return cn(
        "border border-ink bg-paper text-ink",
        "before:bg-shell hover:text-ink",
      );
    case "ghost":
      return cn("border border-transparent bg-transparent text-ink", "before:bg-shell");
  }
}

const Arrow = ({ size }: { size: Size }) => (
  <svg
    aria-hidden
    className={cn(
      iconSizeClasses[size],
      "rotate-45 rounded-full border border-current p-1.5 transition duration-300 ease-linear",
      "group-hover:rotate-90 group-hover:border-transparent group-hover:bg-paper",
    )}
    viewBox="0 0 16 19"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
      className="fill-current"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      variant = "primary",
      size = "md",
      withArrow = true,
      loading = false,
      className,
      disabled,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "group relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-md font-semibold",
          "transition-colors duration-700 ease-[var(--ease-premium)]",
          "before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-full",
          "before:transition-all before:duration-700 before:ease-[var(--ease-premium)]",
          "hover:before:left-0 hover:before:w-full hover:before:scale-150",
          "disabled:cursor-not-allowed disabled:opacity-60",
          sizeClasses[size],
          variantClasses(variant),
          className,
        )}
        {...rest}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : null}
          <span>{children}</span>
        </span>
        {withArrow && variant !== "ghost" ? (
          <span className="relative z-10">
            <Arrow size={size} />
          </span>
        ) : null}
      </button>
    );
  },
);
