import type { ArmsVisual } from "@/data/types";
import { VisualFrame } from "./visual-frame";

/** Market Approach Desk: the two implementations, counted at the same receiver. */
export function Arms({ visual }: { visual: ArmsVisual }) {
  return (
    <VisualFrame title="Kill test · forced overlap" summary={visual.summary} source={visual.source}>
      <div className="grid gap-3 sm:grid-cols-2">
        {visual.arms.map((arm) => (
          <div key={arm.name} className="rounded-[var(--radius-sm)] border border-line bg-surface-2 p-4">
            <p className="label">{arm.name}</p>
            <p
              className={`num mt-2 text-[44px] font-semibold leading-none tracking-[-0.03em] ${
                arm.tone === "fail" ? "text-fail" : arm.tone === "pass" ? "text-pass" : "text-ink"
              }`}
            >
              {arm.observed}
            </p>
            <p className="mt-1 font-mono text-[10.5px] text-muted">{visual.unit}</p>
            <p className="mt-3 text-[12.5px] leading-5 text-ink-2">{arm.detail}</p>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
