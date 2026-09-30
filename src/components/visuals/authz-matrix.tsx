import type { AuthzRow, AuthzVisual } from "@/data/types";
import { VisualFrame } from "./visual-frame";

function Outcome({ value, attack }: { value: string; attack: boolean }) {
  const [verdict, ...reason] = value.split(" · ");
  const allowed = verdict.startsWith("allowed");
  // An attack that is allowed is the failure this matrix exists to show.
  const breach = attack && allowed;
  return (
    <span className="flex flex-col gap-0.5">
      <span
        className={`font-mono text-[12px] leading-4 ${
          breach ? "font-semibold text-fail" : allowed ? "text-ink" : "text-ink-2"
        }`}
      >
        {breach ? "▲ " : ""}
        {verdict}
      </span>
      {reason.length ? (
        <span className="font-mono text-[10.5px] leading-4 text-id">{reason.join(" · ")}</span>
      ) : null}
    </span>
  );
}

function Effects({ row }: { row: AuthzRow }) {
  const [naive, hardened] = row.effects;
  return (
    <span className="num font-mono text-[12px] text-ink-2">
      <span className={naive > hardened ? "text-fail" : ""}>{naive}</span>
      <span className="px-1 text-faint">→</span>
      <span>{hardened}</span>
    </span>
  );
}

function Tag({ attack }: { attack: boolean }) {
  return (
    <span
      className={`font-mono text-[9.5px] uppercase tracking-[0.1em] ${
        attack ? "text-id" : "text-pass"
      }`}
    >
      {attack ? "Attack" : "Legitimate"}
    </span>
  );
}

/** Below the small breakpoint each scenario becomes a block, so the matrix never scrolls sideways. */
function MobileRows({ visual }: { visual: AuthzVisual }) {
  return (
    <ol className="flex flex-col sm:hidden">
      {visual.rows.map((row) => (
        <li key={row.scenario} className="border-t border-line py-3 first:border-t-0 first:pt-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12.5px] leading-[18px] text-ink-2">{row.scenario}</p>
            <Effects row={row} />
          </div>
          <Tag attack={row.attack} />
          <dl className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <dt className="label">Naive</dt>
              <dd className="mt-0.5">
                <Outcome value={row.naive} attack={row.attack} />
              </dd>
            </div>
            <div>
              <dt className="label text-ink">Hardened</dt>
              <dd className="mt-0.5">
                <Outcome value={row.hardened} attack={row.attack} />
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}

/** Agent Authorization Broker: the same scenarios against a naive verifier and the broker. */
export function AuthzMatrix({ visual }: { visual: AuthzVisual }) {
  return (
    <VisualFrame
      title="Security matrix · naive vs hardened"
      summary={visual.summary}
      source={visual.source}
      tone="sunk"
    >
      <MobileRows visual={visual} />
      <div className="hidden sm:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Outcome of each scenario against the naive verifier and the hardened broker,
            with the number of irreversible effects recorded by each.
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="pb-2 pr-3">
                <span className="label">Scenario</span>
              </th>
              <th scope="col" className="pb-2 pr-3">
                <span className="label">Naive</span>
              </th>
              <th scope="col" className="pb-2 pr-3">
                <span className="label text-ink">Hardened</span>
              </th>
              <th scope="col" className="pb-2 text-right">
                <span className="label">Effects</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visual.rows.map((row) => (
              <tr key={row.scenario} className="border-b border-line last:border-0">
                <th scope="row" className="py-2.5 pr-3 align-top font-normal">
                  <span className="mb-1 block text-[12.5px] leading-[18px] text-ink-2">{row.scenario}</span>
                  <Tag attack={row.attack} />
                </th>
                <td className="py-2.5 pr-3 align-top">
                  <Outcome value={row.naive} attack={row.attack} />
                </td>
                <td className="py-2.5 pr-3 align-top">
                  <Outcome value={row.hardened} attack={row.attack} />
                </td>
                <td className="py-2.5 text-right align-top">
                  <Effects row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisualFrame>
  );
}
