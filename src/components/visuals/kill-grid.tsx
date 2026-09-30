import type { KillCondition, KillGridVisual } from "@/data/types";
import { VisualFrame } from "./visual-frame";

const verdictMeta: Record<
  KillCondition["verdict"],
  { word: string; cell: string; text: string }
> = {
  pass: { word: "Pass", cell: "border-line bg-surface", text: "text-pass" },
  fail: { word: "Fail", cell: "border-fail/45 bg-fail-bg", text: "text-fail" },
  "near-vacuous": {
    word: "Pass · near-vacuous",
    cell: "border-warn/40 bg-warn-bg",
    text: "text-warn",
  },
};

/** Parts Answer Gate: the twelve pre-registered kill conditions and how each was graded. */
export function KillGrid({ visual }: { visual: KillGridVisual }) {
  const failed = visual.conditions.filter((c) => c.verdict === "fail");
  return (
    <VisualFrame title="Pre-registered kill conditions" summary={visual.summary} source={visual.source}>
      <p className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="num text-[28px] font-semibold leading-8 tracking-[-0.02em] text-fail">
          {failed.length} of {visual.conditions.length} failed
        </span>
        <span className="font-mono text-[11px] text-muted">
          {failed.map((c) => c.id).join(" · ")}
        </span>
      </p>
      <ol className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {visual.conditions.map((condition) => {
          const meta = verdictMeta[condition.verdict];
          return (
            <li
              key={condition.id}
              className={`flex gap-2.5 rounded-[var(--radius-sm)] border px-2.5 py-2.5 sm:gap-3 sm:px-3 ${meta.cell}`}
            >
              <span className="font-mono text-[18px] font-semibold leading-6 text-ink">
                {condition.id}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span
                  className={`font-mono text-[10px] uppercase leading-4 tracking-[0.08em] ${meta.text}`}
                >
                  {meta.word}
                </span>
                <span className="text-[12px] leading-4 text-ink-2">{condition.label}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </VisualFrame>
  );
}
