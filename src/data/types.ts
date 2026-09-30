/**
 * The shape of everything the site renders. Pages and components derive from these records and
 * never repeat project copy in markup, so adding a project is one entry in `projects.ts`.
 */

/** Each project keeps one visual identity inside the shared design system. */
export type Identity =
  | "ledger"
  | "market"
  | "callsite"
  | "authz"
  | "resolver"
  | "bordereaux"
  | "parts";

export type StatusKind = "complete" | "negative-result";

export interface ProjectStatus {
  kind: StatusKind;
  /** Exactly as the project's own tracker states it. */
  label: string;
  deployment: string;
}

export type Tone = "pass" | "fail" | "neutral";

export interface Metric {
  value: string;
  label: string;
  /** A caveat that must travel with the number. */
  note?: string;
  tone?: Tone;
  /** The one figure the home page shows beside the project. Exactly one per project. */
  lead?: boolean;
}

/**
 * A flagship's card on the home page: one line each, and the skills a reader should see first.
 * The case study uses the long forms.
 */
export interface Brief {
  problem: string;
  built: string;
  /** At most five, each also listed in the project's `skills`. */
  skills: string[];
}

export type StepKind =
  | "input"
  | "deterministic"
  | "model"
  | "human"
  | "store"
  | "effect"
  | "gate";

export interface FlowStep {
  label: string;
  detail?: string;
  kind: StepKind;
}

export interface FlowBranch {
  label: string;
  /** The steps are mutually exclusive outcomes rather than a sequence. */
  alternatives?: boolean;
  steps: FlowStep[];
}

/** An architecture diagram: a main path, optionally with labelled branches or parallel lanes. */
export interface Flow {
  caption: string;
  /** One or more lanes rendered side by side (for two-arm comparisons) or stacked. */
  lanes: { title?: string; steps: FlowStep[] }[];
  branches?: FlowBranch[];
  note?: string;
}

export interface Shot {
  src: string;
  darkSrc?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /**
   * Where the project says it was captured: its live deployment, or — when the project does not
   * record the host — simply its own repository.
   */
  source: "live" | "repo";
}

export interface CaseSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Fact {
  label: string;
  value: string;
}

/* ------------------------------------------------------------------------------------------ */
/* Bespoke evidence visuals. Each is data, taken from the project's own committed artifacts.   */
/* ------------------------------------------------------------------------------------------ */

export interface ChaosScenario {
  scenario: string;
  /** Observed ledger applied-count per adapter configuration, in the order of `configs`. */
  main: number[];
  naive: number[];
}

export interface ChaosVisual {
  type: "chaos";
  configs: string[];
  scenarios: ChaosScenario[];
  summary: string;
  source: string;
}

export interface AuthzRow {
  scenario: string;
  naive: string;
  hardened: string;
  effects: [number, number];
  attack: boolean;
}

export interface AuthzVisual {
  type: "authz";
  rows: AuthzRow[];
  summary: string;
  source: string;
}

export interface BarRow {
  label: string;
  values: number[];
  highlight?: boolean;
}

export interface BarsVisual {
  type: "bars";
  title: string;
  series: string[];
  rows: BarRow[];
  /** Upper bound for the axis. */
  max: number;
  format: "fixed4" | "fixed3" | "percent";
  summary: string;
  source: string;
}

export interface KillCondition {
  id: string;
  label: string;
  verdict: "pass" | "fail" | "near-vacuous";
}

export interface KillGridVisual {
  type: "killgrid";
  conditions: KillCondition[];
  summary: string;
  source: string;
}

export interface ArmsVisual {
  type: "arms";
  arms: { name: string; observed: number; detail: string; tone: Tone }[];
  unit: string;
  summary: string;
  source: string;
}

export interface SplitVisual {
  type: "split";
  columns: string[];
  rows: { label: string; values: string[]; tones?: (Tone | null)[] }[];
  summary: string;
  source: string;
}

export type EvidenceVisual =
  | ChaosVisual
  | AuthzVisual
  | BarsVisual
  | KillGridVisual
  | ArmsVisual
  | SplitVisual;

export interface Project {
  slug: string;
  index: number;
  name: string;
  /** A one- or two-word name for compact references. */
  short: string;
  /** The business area, in two or three words. */
  domain: string;
  tagline: string;
  identity: Identity;
  status: ProjectStatus;
  flagship: boolean;
  /** One sentence for the gallery. */
  summary: string;
  problem: string;
  built: string;
  hardPart: string;
  /** Flagships only: the home page's card copy. */
  brief?: Brief;
  evidence: Metric[];
  visual: EvidenceVisual;
  flow: Flow;
  sections: CaseSection[];
  limitations: string[];
  facts: Fact[];
  stack: string[];
  skills: string[];
  shots: Shot[];
  githubUrl: string;
  liveUrl: string;
  /**
   * Shown beside the Live demo link, only where the demo itself cannot explain a slow first
   * load — a server-rendered app whose host shows its own wake-up screen while it starts.
   */
  demoNote?: string;
  backendUrl?: string;
  backendLabel?: string;
}
