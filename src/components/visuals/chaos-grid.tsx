import type { ChaosVisual } from "@/data/types";
import { VisualFrame } from "./visual-frame";

const SHORT: Record<string, string> = {
  ENFORCES_KEY: "Key",
  "BY_OPERATION_ID only": "Op id",
  "NONE / NONE": "None",
};

function Cell({ value }: { value: number }) {
  const duplicate = value > 1;
  return (
    <td
      className={`num h-8 border-l border-line text-center font-mono text-[13px] ${
        duplicate
          ? "bg-fail-bg font-semibold text-fail"
          : value === 0
            ? "text-faint"
            : "text-ink"
      }`}
    >
      {value}
      {duplicate ? <span className="sr-only"> (posted twice)</span> : null}
    </td>
  );
}

function MiniCells({ values }: { values: number[] }) {
  return (
    <span className="flex gap-1">
      {values.map((value, i) => (
        <span
          key={i}
          className={`num inline-flex size-7 items-center justify-center rounded-[4px] border font-mono text-[12px] ${
            value > 1
              ? "border-fail/40 bg-fail-bg font-semibold text-fail"
              : value === 0
                ? "border-line text-faint"
                : "border-line text-ink"
          }`}
        >
          {value}
          {value > 1 ? <span className="sr-only"> (posted twice)</span> : null}
        </span>
      ))}
    </span>
  );
}

/** Below the small breakpoint the table becomes one block per scenario, so nothing scrolls sideways. */
function MobileRows({ visual }: { visual: ChaosVisual }) {
  return (
    <ol className="flex flex-col sm:hidden">
      {visual.scenarios.map((row) => (
        <li key={row.scenario} className="border-t border-line py-2.5 first:border-t-0 first:pt-0">
          <p className="text-[12.5px] leading-4 text-ink-2">{row.scenario}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            <span className="flex items-center gap-2">
              <span className="label w-9 text-ink">main</span>
              <MiniCells values={row.main} />
            </span>
            <span className="flex items-center gap-2">
              <span className="label w-9">naive</span>
              <MiniCells values={row.naive} />
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Ledger Exception Control Plane: applied postings per failure scenario, main against naive. */
export function ChaosGrid({ visual }: { visual: ChaosVisual }) {
  return (
    <VisualFrame title="Chaos suite · applied postings" summary={visual.summary} source={visual.source}>
      <p className="mb-3 text-[12.5px] leading-5 text-ink-2">
        Each number is how many times the ledger applied one adjustment:{" "}
        <span className="font-medium text-ink">1</span> is correct,{" "}
        <span className="font-medium text-fail">2</span> is a double posting.
      </p>
      <MobileRows visual={visual} />
      <div className="hidden sm:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Adjustments the simulated ledger applied for one unit of work, per failure scenario and
            adapter configuration, for the main branch and the naive baseline.
          </caption>
          <thead>
            <tr>
              <th scope="col" rowSpan={2} className="pb-2 align-bottom">
                <span className="label">Scenario</span>
              </th>
              <th
                scope="colgroup"
                colSpan={visual.configs.length}
                className="border-l border-line pb-1 text-center"
              >
                <span className="label text-ink">main</span>
              </th>
              <th
                scope="colgroup"
                colSpan={visual.configs.length}
                className="border-l border-line pb-1 text-center"
              >
                <span className="label">naive</span>
              </th>
            </tr>
            <tr>
              {[0, 1].flatMap((group) =>
                visual.configs.map((config) => (
                  <th
                    key={`${group}-${config}`}
                    scope="col"
                    className="w-11 border-l border-line pb-2 text-center font-mono text-[10px] font-normal text-muted sm:w-14"
                  >
                    <abbr title={config} className="no-underline">
                      {SHORT[config] ?? config}
                    </abbr>
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {visual.scenarios.map((row) => (
              <tr key={row.scenario} className="border-t border-line">
                <th
                  scope="row"
                  className="py-1.5 pr-3 text-[12.5px] font-normal leading-4 text-ink-2"
                >
                  {row.scenario}
                </th>
                {row.main.map((value, i) => (
                  <Cell key={`m${i}`} value={value} />
                ))}
                {row.naive.map((value, i) => (
                  <Cell key={`n${i}`} value={value} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[10.5px] leading-4 text-muted">
        <span className="sm:hidden">Three cells per branch, one per adapter capability: </span>
        <span className="hidden sm:inline">Adapter capability: </span>
        {visual.configs.map((c) => `${SHORT[c] ?? c} = ${c}`).join(" · ")}
      </p>
    </VisualFrame>
  );
}
