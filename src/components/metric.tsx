import type { Metric as MetricData, Tone } from "@/data/types";

/* Positive figures stay in ink; only negative results take a colour, and a word with it. */
const toneText: Record<Tone, string> = {
  pass: "text-ink",
  fail: "text-fail",
  neutral: "text-ink",
};

/* Only negative results carry a word: a reader must not mistake one for a success. */
const toneWord: Record<Tone, string | null> = {
  pass: null,
  fail: "Negative result",
  neutral: null,
};

export function ToneTag({ tone }: { tone?: Tone }) {
  const word = tone ? toneWord[tone] : null;
  if (!tone || !word) return null;
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.08em] ${
        tone === "fail" ? "text-fail" : "text-pass"
      }`}
    >
      {word}
    </span>
  );
}

export function Metric({ metric, size = "md" }: { metric: MetricData; size?: "md" | "lg" }) {
  const tone = metric.tone ?? "neutral";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2.5">
        <span
          className={`num font-semibold tracking-[-0.02em] ${toneText[tone]} ${
            size === "lg" ? "text-[30px] leading-9 sm:text-[34px]" : "text-[24px] leading-8"
          }`}
        >
          {metric.value}
        </span>
        <ToneTag tone={metric.tone} />
      </div>
      <p className="text-pretty text-[13.5px] leading-5 text-ink-2">{metric.label}</p>
      {metric.note ? <p className="text-[12.5px] leading-5 text-muted">{metric.note}</p> : null}
    </div>
  );
}
