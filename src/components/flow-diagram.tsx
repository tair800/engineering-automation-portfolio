import type { Flow, FlowStep, StepKind } from "@/data/types";

const KIND: Record<StepKind, { tag: string; box: string; tagClass: string; legend: string }> = {
  input: {
    tag: "Input",
    box: "border-dashed border-line-strong bg-surface",
    tagClass: "text-muted",
    legend: "Arrives from outside the system",
  },
  deterministic: {
    tag: "Code",
    box: "border-line bg-surface",
    tagClass: "text-muted",
    legend: "Deterministic code",
  },
  model: {
    tag: "Model",
    box: "hatch border-id/60 bg-surface",
    tagClass: "text-id",
    legend: "A model proposal, confined to a closed output",
  },
  human: {
    tag: "Human",
    box: "border-line bg-surface-2",
    tagClass: "text-ink-2",
    legend: "A person decides",
  },
  gate: {
    tag: "Gate",
    box: "border-line border-l-[3px] border-l-ink bg-surface",
    tagClass: "text-ink",
    legend: "Decides whether work proceeds",
  },
  store: {
    tag: "Store",
    box: "border-line bg-bg-sunk",
    tagClass: "text-muted",
    legend: "Durable state",
  },
  effect: {
    tag: "Effect",
    box: "border-ink/70 bg-surface",
    tagClass: "text-ink",
    legend: "An irreversible or outbound effect",
  },
};

/* The glyph between two steps: an arrow for a sequence, "or" between alternative outcomes. */
const CONNECTOR = {
  sequence:
    "before:text-[13px] sm:before:left-[-15px] max-sm:before:content-['↓'] sm:before:content-['→']",
  alternatives:
    "before:font-mono before:text-[10px] before:uppercase before:tracking-[0.08em] sm:before:left-[-17px] before:content-['or']",
};

function Step({
  step,
  number,
  connector,
}: {
  step: FlowStep;
  number: string;
  connector: keyof typeof CONNECTOR;
}) {
  const kind = KIND[step.kind];
  return (
    <li
      className={`relative before:absolute before:leading-none before:text-faint max-sm:before:-top-[17px] max-sm:before:left-4 sm:before:top-1/2 sm:before:-translate-y-1/2 first:before:content-none ${CONNECTOR[connector]}`}
    >
      <div className={`flex h-full flex-col rounded-[var(--radius-sm)] border px-3 py-2.5 ${kind.box}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="num font-mono text-[10px] text-faint">{number}</span>
          <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${kind.tagClass}`}>
            {kind.tag}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] font-medium leading-[18px] text-ink">{step.label}</p>
        {step.detail ? (
          <p className="mt-1 text-[11.5px] leading-4 text-muted">{step.detail}</p>
        ) : null}
      </div>
    </li>
  );
}

function StepList({
  steps,
  prefix = "",
  alternatives = false,
}: {
  steps: FlowStep[];
  prefix?: string;
  alternatives?: boolean;
}) {
  const List = alternatives ? "ul" : "ol";
  return (
    <List className="grid grid-cols-1 gap-y-5 sm:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] sm:gap-x-5 sm:gap-y-3">
      {steps.map((step, i) => (
        <Step
          key={`${step.label}-${i}`}
          step={step}
          number={`${prefix}${String(i + 1).padStart(2, "0")}`}
          connector={alternatives ? "alternatives" : "sequence"}
        />
      ))}
    </List>
  );
}

/** An architecture diagram built from the project's own components; nothing is drawn that it lacks. */
export function FlowDiagram({ flow }: { flow: Flow }) {
  const kinds = Array.from(
    new Set([
      ...flow.lanes.flatMap((lane) => lane.steps.map((s) => s.kind)),
      ...(flow.branches ?? []).flatMap((b) => b.steps.map((s) => s.kind)),
    ]),
  );
  const order = Object.keys(KIND) as StepKind[];
  kinds.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  return (
    <figure className="rounded-[var(--radius)] border border-line bg-bg-sunk/60 p-4 sm:p-5">
      <div className="flex flex-col gap-6">
        {flow.lanes.map((lane, laneIndex) => (
          <div key={lane.title ?? laneIndex}>
            {lane.title ? <p className="label mb-3 text-ink-2">{lane.title}</p> : null}
            <StepList steps={lane.steps} prefix={flow.lanes.length > 1 ? `${String.fromCharCode(65 + laneIndex)}` : ""} />
          </div>
        ))}
        {flow.branches?.map((branch) => (
          <div key={branch.label} className="border-t border-dashed border-line-strong pt-4">
            <p className="label mb-3">
              <span aria-hidden="true" className="mr-1.5 text-faint">
                ↳
              </span>
              Branch · {branch.label}
              {branch.alternatives ? <span className="text-faint"> · one of</span> : null}
            </p>
            <StepList steps={branch.steps} prefix="↳" alternatives={branch.alternatives} />
          </div>
        ))}
      </div>
      <figcaption className="mt-5 border-t border-line pt-4">
        <p className="text-[13px] leading-5 text-ink-2">{flow.caption}</p>
        {flow.note ? <p className="mt-1.5 text-[12.5px] leading-5 text-muted">{flow.note}</p> : null}
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Legend">
          {kinds.map((kind) => (
            <li key={kind} className="flex items-center gap-1.5 text-[11.5px] text-muted">
              <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${KIND[kind].tagClass}`}>
                {KIND[kind].tag}
              </span>
              <span>{KIND[kind].legend}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
