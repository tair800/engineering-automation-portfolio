/**
 * Three rules that recur across the projects, stated once on the home page. The evidence for each
 * lives in the case studies, not here.
 */
export interface Principle {
  title: string;
  /** One short line; no longer. */
  detail: string;
}

export const principles: Principle[] = [
  {
    title: "Deterministic systems own financial truth",
    detail: "Amounts and matches are computed by tested code; a model, where used, picks from a closed set.",
  },
  {
    title: "Measure against real baselines",
    detail: "Each system is scored beside the simplest thing that could have worked, including where that baseline wins.",
  },
  {
    title: "Publish negative results",
    detail: "Parts Answer Gate's pre-registered release gate failed; it is published as failed, criteria unchanged.",
  },
];
