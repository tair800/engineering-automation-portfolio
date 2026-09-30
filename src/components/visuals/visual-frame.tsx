import type { ReactNode } from "react";

/** The inset panel every evidence visual sits in, with its summary and its source. */
export function VisualFrame({
  title,
  summary,
  source,
  children,
  tone = "surface",
}: {
  title: string;
  summary: string;
  source: string;
  children: ReactNode;
  tone?: "surface" | "sunk";
}) {
  return (
    <figure
      className={`flex h-full flex-col rounded-[var(--radius)] border border-line ${
        tone === "sunk" ? "bg-bg-sunk" : "bg-surface"
      }`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <p className="label text-ink-2">{title}</p>
      </div>
      <div className="min-w-0 flex-1 px-3 py-4 sm:px-4">{children}</div>
      <figcaption className="border-t border-line px-4 py-3">
        <p className="text-[12.5px] leading-5 text-ink-2">{summary}</p>
        <p className="mt-1.5 font-mono text-[10.5px] leading-4 text-muted">Source: {source}</p>
      </figcaption>
    </figure>
  );
}
