import * as React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (row: T) => React.ReactNode;
    align?: "left" | "right" | "center";
    width?: string;
  }[];
  rows: T[];
  caption?: string;
  className?: string;
  empty?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  caption,
  className,
  empty,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-sand bg-shell p-8 text-sm text-muted">
        {empty ?? "Aucune donnée."}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-sand bg-shell shadow-[var(--shadow-level-1)]",
        className,
      )}
    >
      {caption ? (
        <p className="label-uppercase border-b border-sand bg-shell px-5 py-3 text-muted">
          {caption}
        </p>
      ) : null}
      <div className="scrollbar-quiet overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-shell">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={cn(
                    "label-uppercase px-5 py-3 text-left text-muted",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                  )}
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-t border-sand transition-colors hover:bg-mist"
              >
                {columns.map((c, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "px-5 py-4 align-top text-ink",
                      c.align === "right" && "text-right tabular-nums",
                      c.align === "center" && "text-center",
                    )}
                  >
                    {c.render
                      ? c.render(row)
                      : (row[c.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
