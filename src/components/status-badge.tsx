import type { ProjectStatus } from "@/data/types";

/** The project's status exactly as its own tracker states it, and whether it is deployed. */
export function StatusBadge({ status, compact = false }: { status: ProjectStatus; compact?: boolean }) {
  const negative = status.kind === "negative-result";
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={`inline-flex max-w-full items-start gap-1.5 text-balance rounded-[var(--radius-sm)] border px-2 py-0.5 font-mono text-[10.5px] uppercase leading-4 tracking-[0.06em] ${
          negative ? "border-fail/40 bg-fail-bg text-fail" : "border-line bg-surface text-ink-2"
        }`}
      >
        <span
          aria-hidden="true"
          className={`mt-[5px] size-1.5 shrink-0 rounded-full ${negative ? "bg-fail" : "bg-pass"}`}
        />
        {status.label}
      </span>
      {compact ? null : (
        <span className="inline-flex items-center rounded-[var(--radius-sm)] border border-line bg-surface px-2 py-0.5 font-mono text-[10.5px] uppercase leading-4 tracking-[0.06em] text-muted">
          {status.deployment}
        </span>
      )}
    </span>
  );
}
