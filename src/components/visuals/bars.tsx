import type { BarsVisual } from "@/data/types";
import { VisualFrame } from "./visual-frame";

function format(value: number, kind: BarsVisual["format"]) {
  if (kind === "percent") return `${(value * 100).toFixed(1)}%`;
  return value.toFixed(kind === "fixed4" ? 4 : 3);
}

/** Horizontal bars on a zero-based axis, so small differences are not exaggerated. */
export function Bars({ visual }: { visual: BarsVisual }) {
  const [primary, secondary] = visual.series;
  return (
    <VisualFrame title={visual.title} summary={visual.summary} source={visual.source}>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-muted">
          <span aria-hidden="true" className="h-2 w-3 rounded-[2px] bg-id" />
          {primary}
        </span>
        {secondary ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-muted">
            <span aria-hidden="true" className="h-2 w-3 rounded-[2px] bg-line-strong" />
            {secondary}
          </span>
        ) : null}
      </div>
      <table className="w-full border-collapse">
        <caption className="sr-only">{visual.title}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Method</th>
            {visual.series.map((series) => (
              <th key={series} scope="col">
                {series}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visual.rows.map((row) => (
            <tr key={row.label} className="border-t border-line first:border-0">
              <th
                scope="row"
                className={`w-[38%] py-2.5 pr-3 text-left align-middle font-mono text-[11.5px] font-normal leading-4 ${
                  row.highlight ? "text-ink" : "text-muted"
                }`}
              >
                {row.label}
              </th>
              {visual.series.map((series, i) => (
                <td key={series} className="sr-only">
                  {format(row.values[i], visual.format)}
                </td>
              ))}
              <td aria-hidden="true" className="py-2.5 align-middle">
                <div className="flex flex-col gap-1">
                  {row.values.map((value, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="relative h-2 flex-1 overflow-hidden rounded-[2px] bg-bg-sunk">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-[2px] ${
                            i === 0 ? (row.highlight ? "bg-id" : "bg-id/55") : "bg-line-strong"
                          }`}
                          style={{ width: `${(value / visual.max) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`num w-12 text-right font-mono text-[11.5px] ${
                          i === 0 && row.highlight ? "font-semibold text-ink" : "text-muted"
                        }`}
                      >
                        {format(value, visual.format)}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </VisualFrame>
  );
}
