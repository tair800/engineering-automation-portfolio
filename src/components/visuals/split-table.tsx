import type { SplitVisual, Tone } from "@/data/types";
import { VisualFrame } from "./visual-frame";

const toneClass = (tone: Tone | null | undefined) =>
  tone === "fail" ? "font-semibold text-fail" : tone === "pass" ? "font-semibold text-pass" : "text-ink";

/** Callsite Impact: the development corpus beside the frozen held-out slice. */
export function SplitTable({ visual }: { visual: SplitVisual }) {
  return (
    <VisualFrame title="Development vs held-out" summary={visual.summary} source={visual.source}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Corpus size and scores on the development corpus and on the held-out slice.
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="pb-2">
              <span className="label">Measure</span>
            </th>
            {visual.columns.map((column) => (
              <th key={column} scope="col" className="pb-2 text-right">
                <span className="label">{column}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visual.rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-0">
              <th scope="row" className="py-2 pr-3 text-[12.5px] font-normal text-ink-2">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={i}
                  className={`num py-2 text-right font-mono text-[13px] ${toneClass(row.tones?.[i])}`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </VisualFrame>
  );
}
