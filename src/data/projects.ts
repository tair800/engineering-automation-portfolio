import type { Metric, Project } from "./types";

/**
 * Every figure below is taken from the project's own README or committed artifacts, and each
 * project's repository states how it was produced. Nothing here is rounded up, re-labelled or
 * measured separately for this site. Only finished projects are listed.
 */
export const projects: Project[] = [
  {
    slug: "ledger-exception-control-plane",
    index: 1,
    name: "Ledger Exception Control Plane",
    short: "Ledger",
    domain: "Finance operations",
    tagline:
      "Unmatched settlement lines become approved ledger adjustments, applied at most once per operation, as counted by a simulated ledger.",
    identity: "ledger",
    status: { kind: "complete", label: "Complete · frozen", deployment: "Deployed / live" },
    flagship: true,
    summary:
      "A finance-operations control plane: deterministic matching clears the bulk, a model proposes a treatment code for the residual, a human authorises it, and code computes the amount.",
    problem:
      "Payment-provider settlement files never fully match the general ledger, and the residual is resolved by hand at month-end. The expensive failures are silent: an adjustment posted twice because a retry fired, or posted to the wrong account, surfaces months later in reported revenue.",
    built:
      "Ingestion with batch quarantine, deterministic matching with per-currency tolerance bands, one classified exception per residual with an evidence pack, a model confined to a closed enum of treatment codes, role-separated human approval, a pure Decimal amount calculator, and a transactional outbox with bounded retry, a dead-letter queue and a recovery path for ambiguous outcomes.",
    hardPart:
      "A send whose outcome nobody knows: the ledger may have committed the posting and the response was lost. The system records it as UNKNOWN, never retries it on the assumption it failed, and follows the adapter's declared capability: a bounded re-send under the same operation id where the ledger enforces the key, reconciliation by query where it can be queried, otherwise an operator.",
    plain: {
      does: "Resolves mismatches between payment records and a company's books, and is designed so a retried request never posts the same correction twice.",
      matters: "A duplicated or wrong correction quietly distorts reported revenue, and is usually found months later.",
      built: "Built automatic matching, AI that suggests fixes but never amounts, and a person's approval before anything is posted.",
      result: "In 21 of 21 failure-test runs no correction was posted twice, while a simpler version double-posted in 5 of 7 scenarios. In one run against a live model, all 177 of its wrong suggestions were refused; the public demo uses a labelled stand-in.",
      figure: { value: "21 / 21", label: "test runs with no double posting on a simulated ledger; a simpler version double-posted in 5 of 7 scenarios" },
      tech: ["Python", "FastAPI", "PostgreSQL", "Next.js"],
    },
    evidence: [
      {
        value: "21 / 21",
        label: "failure-scenario runs (7 scenarios × 3 ledger configurations) in which no adjustment was applied twice, counted by the simulated ledger itself",
        note: "Where the ledger enforces the key, the simulated ledger does the suppressing: those runs show the dispatcher behaving correctly given an enforcing ledger, not that any real ledger enforces anything.",
        tone: "pass",
        lead: true,
      },
      {
        value: "5 of 7",
        label: "failure scenarios in which a deliberately naive version posted the same adjustment twice",
        note: "The baseline is a legitimate implementation missing specific safeguards, documented omission by omission.",
      },
      {
        value: "42 / 42",
        label: "results, across both versions, that matched expectations declared before the run",
      },
      {
        value: "27.9%",
        label: "live model accuracy over 247 answered records; answering “escalate” every time would score 85.6%",
        note: "The model often proposed a treatment where escalation was correct. The account policy refuses all 177 such answers, and human approval stands in front of the one that would have priced. On the 36 priceable records it scored 97.2%.",
        tone: "fail",
      },
    ],
    visual: {
      type: "chaos",
      configs: ["ENFORCES_KEY", "BY_OPERATION_ID only", "NONE / NONE"],
      scenarios: [
        { scenario: "Crash before commit", main: [1, 1, 1], naive: [2, 2, 2] },
        { scenario: "Duplicate webhook delivery", main: [1, 1, 1], naive: [2, 2, 2] },
        { scenario: "Worker killed mid-batch", main: [1, 1, 1], naive: [0, 0, 0] },
        { scenario: "Two workers claim one residual", main: [1, 1, 1], naive: [2, 2, 2] },
        { scenario: "Replay of a consumed approval token", main: [1, 1, 1], naive: [2, 2, 2] },
        { scenario: "Lost response after a committed ledger write", main: [1, 1, 1], naive: [2, 2, 2] },
        { scenario: "Ledger returns an ambiguous 5xx", main: [1, 0, 0], naive: [1, 1, 1] },
      ],
      summary:
        "Adjustments posted at the simulated ledger for one unit of work, counted by the ledger itself. main never exceeds one; its two zeros are correct outcomes — resolved by query, or handed to an operator — not shortfalls.",
      source: "README · chaos suite results, generated by make chaos-table against real PostgreSQL",
    },
    flow: {
      caption: "Everything outside the one model step is deterministic and unit-tested.",
      lanes: [
        {
          steps: [
            { label: "Settlement file", detail: "ingest, or quarantine the batch", kind: "input" },
            { label: "Deterministic match", detail: "per-currency tolerance bands", kind: "deterministic" },
            { label: "Exception + evidence pack", detail: "one per residual", kind: "deterministic" },
            { label: "Treatment code", detail: "closed enum · no numeric field · may abstain", kind: "model" },
            { label: "Approval by role", detail: "controller approves · analyst may reject", kind: "human" },
            { label: "Amount, account, period", detail: "pure Decimal calculator", kind: "deterministic" },
            { label: "Operation id + outbox", detail: "one transaction", kind: "store" },
            { label: "Dispatch", detail: "capability-declaring ledger adapter", kind: "effect" },
          ],
        },
      ],
      branches: [
        {
          label: "Outcome UNKNOWN — by the adapter's declared capability",
          alternatives: true,
          steps: [
            { label: "Re-send, same operation id", detail: "ENFORCES_KEY · bounded, inside the declared window", kind: "effect" },
            { label: "Reconcile by query", detail: "BY_OPERATION_ID only", kind: "gate" },
            { label: "Manual recovery", detail: "neither · the automatic path stops", kind: "human" },
          ],
        },
      ],
    },
    sections: [
      {
        heading: "The model's only channel is a closed enum",
        paragraphs: [
          "The model proposes a treatment — rebook, accrue, write_off or escalate — with a confidence band, citations and the option to abstain. Its response schema contains no numeric type anywhere in its tree, and a CI guard walks the schema and fails the build if one appears.",
          "The rationale is provenance for humans only: no code parses it. The amount calculator takes the exception's persisted facts, a treatment code and system-owned ledger context, and a guard asserts it cannot import the proposal model. Where a treatment cannot be priced deterministically the answer is escalate — the correct label for 214 of the 250 golden records.",
        ],
      },
      {
        heading: "Five guarantees, deliberately kept apart",
        paragraphs: [
          "Conflating them is how the stronger claim gets asserted by accident, so the repository states each with its own condition.",
        ],
        bullets: [
          "One claim per residual and one adjustment per operation id — unconditional.",
          "Transactional outbox: the intent is never lost — unconditional, and deliberately at-least-once.",
          "No second dispatch for a known terminal outcome — bounded by what the system can know.",
          "Adapters declare their capabilities and outcomes are three-valued — an adapter that cannot say UNKNOWN is rejected.",
          "An effectively-once financial side effect — only where the adapter enforces an idempotency key or exposes a queryable posting identity. Otherwise the claim is withdrawn, not reworded.",
        ],
      },
      {
        heading: "A kill test that could have failed",
        paragraphs: [
          "The reliability claim is proven against a deliberately naive branch that double-posts — a suite that passes on both branches proves nothing. Every scenario runs against three adapter capability configurations on real PostgreSQL, and every number is the simulated ledger's own applied count, never inferred from this system's records.",
          "The results table in the README is generated from that run, and a check fails the build if it drifts. A five-mutant battery plants the ways such a gate can be green and worthless.",
        ],
      },
      {
        heading: "The live model measurement, and what contains the wrong answers",
        paragraphs: [
          "One bounded run over the 250-record golden set: 251 live calls against a declared ceiling of 750, 98.8% usable through the shipped path, p95 latency 8.15 s. The model was good at the judgement and bad at declining to make one: of the 211 escalate-labelled records it answered, 177 got a concrete treatment.",
          "Three independent fail-closed controls contain different parts of that. During the run the citation check refused a hallucinated evidence id; the account policy refuses all 177, because no account is configured for those classifications and so no amount can be computed; and the approval gate stands in front of the single wrong answer that would have priced. Cost was not measured: the subscription-backed route returns no billing field, and no list-price estimate is made.",
        ],
      },
    ],
    limitations: [
      "Every row is synthetic and the ledger is simulated; there is no real ledger integration.",
      "Nothing runs the stages in sequence as a service: the demo seeder composes them, ingestion is command-line driven, and the retry and reconciliation passes are bounded one-shot passes rather than daemons.",
      "The shipped package makes no live model call: the deployed demo uses a declared stand-in, and the one live measurement ran through a test-only transport on a workstation.",
      "The effectively-once effect is conditional on the ledger adapter's declared and proven capabilities.",
      "Under ENFORCES_KEY the suppression is performed by a simulated ledger written in the repository, so it shows the dispatcher behaving correctly given an enforcing ledger — not that any real ledger enforces anything.",
      "The free-tier backend sleeps; the first request after a quiet period can take up to a minute.",
    ],
    facts: [
      { label: "Golden set", value: "250 records" },
      { label: "Chaos cells", value: "7 scenarios × 3 adapter configurations × 2 branches" },
      { label: "Decision record", value: "71 numbered ADRs, ADR-001 to ADR-071" },
      { label: "Demo sign-in", value: "one click, as a public analyst, operator or controller role" },
    ],
    stack: [
      "Python 3.12",
      "FastAPI",
      "PostgreSQL 16",
      "SQLAlchemy 2",
      "Alembic",
      "Next.js 15",
      "TypeScript",
      "Docker",
      "GitHub Actions",
      "Vercel",
      "Render",
      "Neon",
    ],
    skills: [
      "Idempotency",
      "Transactional outbox",
      "Bounded retry & DLQ",
      "Deterministic money",
      "LLM integration",
      "Evaluation vs baselines",
      "Role-separated approval",
      "Audit trail",
    ],
    shots: [
      {
        src: "/shots/ledger-exception-control-plane/queue.webp",
        width: 1440,
        height: 642,
        alt: "Settlement exceptions queue listing seven residuals with classification, stage and amount",
        caption: "The exception queue: residuals the deterministic matcher could not clear.",
        source: "live",
      },
      {
        src: "/shots/ledger-exception-control-plane/exception-detail.webp",
        width: 1440,
        height: 900,
        alt: "Exception detail: the evidence pack, and a treatment proposal from the declared stand-in in the panel labelled model output",
        caption: "One exception: the evidence pack, and a proposal that selects what to do — never how much.",
        source: "live",
      },
      {
        src: "/shots/ledger-exception-control-plane/fault-injection.webp",
        width: 1440,
        height: 876,
        alt: "Fault-injection page in demo mode, before a crash is injected: an exception selector with Crash after the socket write and Reset the demonstration buttons",
        caption: "The fault-injection control: it crashes a dispatch between the socket write and the response, then reports the ledger's own applied count.",
        source: "live",
      },
    ],
    githubUrl: "https://github.com/tair800/ledger-exception-control-plane",
    liveUrl: "https://ledger-exception-control-plane-livid.vercel.app",
    backendUrl: "https://lecp-demo-api.onrender.com/docs",
    backendLabel: "API docs",
  },
  {
    slug: "market-approach-desk",
    index: 2,
    name: "Market Approach Desk",
    short: "Market Desk",
    domain: "Insurance broking",
    tagline:
      "One broker workflow built twice — in n8n and in typed Python — and counted at a fake carrier while two executions are forced to overlap.",
    identity: "market",
    status: { kind: "complete", label: "Complete · frozen", deployment: "Deployed / live" },
    flagship: false,
    summary:
      "An n8n workflow and a typed Python service implement one irreversible insurance workflow; a harness forces two executions of each to overlap, and a fake carrier receiver counts what actually arrived.",
    problem:
      "A broker approaching the same carrier twice for the same risk blocks the market: the underwriter declines to re-quote and the placement can be lost. An email that reached an underwriter cannot be retracted.",
    built:
      "A 17-node n8n workflow and a typed Python service for the same approach workflow, a harness that forces two scheduler executions to overlap with a barrier rather than a sleep, a fake carrier receiver, and an operator console with a comparison screen. In the kill test the n8n arm runs through a node-by-node simulator of its exported workflow.",
    hardPart:
      "Measuring at the receiver rather than asking either arm what it did, then showing that SELECT … FOR UPDATE SKIP LOCKED — not only the cleared due_at — stops a second claim when two claim transactions overlap before either commits.",
    plain: {
      does: "Compares an n8n version and a Python version of an insurance broker's workflow at one job: never sending an insurer the same request twice.",
      matters: "Approaching the same insurer twice for one risk can cost the placement, and an email that reached an underwriter cannot be recalled.",
      built: "Built the same broker workflow in n8n and in typed Python, a test harness that makes two runs overlap, and a fake insurer that counts what actually arrives.",
      result: "When two runs overlapped, the n8n version sent the same approach twice and the Python version once. The n8n workflow was run through a simulator of its exported nodes, not a live n8n server.",
      tech: ["Python", "n8n", "PostgreSQL", "Next.js"],
    },
    evidence: [
      {
        value: "2 vs 1",
        label: "approaches the fake carrier counted under forced overlap: n8n arm vs Python arm",
        note: "The n8n arm runs through a node-by-node simulator of its exported workflow, not a live n8n instance. The duplicate comes from the workflow having no claim boundary across executions, not from n8n itself.",
        lead: true,
      },
      {
        value: "1",
        label: "distinct idempotency key in both arms — the same key reached the carrier twice from the n8n arm",
      },
    ],
    visual: {
      type: "arms",
      unit: "approaches observed at the carrier",
      arms: [
        {
          name: "n8n arm",
          observed: 2,
          detail: "read due → filter → send → write back, with no claim boundary between executions; simulated node by node",
          tone: "fail",
        },
        {
          name: "Python arm",
          observed: 1,
          detail: "one transaction claims with SKIP LOCKED and checks placing authority and a 30-day decline cooling period inside it",
          tone: "pass",
        },
      ],
      summary:
        "Two scheduler executions forced to overlap at the moment the failure lives; each arm is counted by a fresh instance of the same fake receiver, with identical fixtures. CI re-runs it on every push to main and on pull requests.",
      source: "docs/killtest.json, written by the kill test that measured it",
    },
    flow: {
      caption: "Two implementations of one workflow, one harness, one receiver design.",
      lanes: [
        {
          title: "n8n arm",
          steps: [
            { label: "Schedule trigger", kind: "input" },
            { label: "Read due approaches", kind: "store" },
            { label: "Filter eligible", detail: "outside any transaction", kind: "deterministic" },
            { label: "HTTP send", kind: "effect" },
            { label: "Write state back", kind: "store" },
          ],
        },
        {
          title: "Python arm",
          steps: [
            { label: "Scheduler", kind: "input" },
            { label: "Claim in one transaction", detail: "FOR UPDATE SKIP LOCKED + authority and decline-cooling checks", kind: "gate" },
            { label: "Commit", kind: "store" },
            { label: "Send", detail: "outside the claim transaction", kind: "effect" },
            { label: "Record outcome", kind: "store" },
          ],
        },
      ],
      note: "In the kill test the n8n arm runs through a node-by-node simulator of its exported workflow. Each arm sends to a fresh in-process fake receiver, which counts approaches per (placement, market, stage).",
    },
    sections: [
      {
        heading: "Why the n8n arm duplicates",
        paragraphs: [
          "The workflow is what a competent automation engineer would build. There is no transaction around its steps and no lock across executions, so a second execution reads the due set while the first is between its send and its write. Both see the same approach as eligible, and both send.",
          "That is not an n8n bug. A review corrected the project's first framing: n8n's Postgres node runs free SQL, so a claiming UPDATE … SKIP LOCKED … RETURNING can move the claim into one statement — at which point the reliability boundary lives in the database and the engine is a scheduler around it. That variant is named and explicitly not measured.",
        ],
      },
      {
        heading: "What the Python arm does instead",
        paragraphs: [
          "The claim and its conflict rules run in one transaction with SELECT … FOR UPDATE SKIP LOCKED, so a concurrent scheduler skips a claimed row instead of blocking on it. Two rules can refuse an approach: a carrier outside the broker's placing authority, and a carrier that declined this risk within the last 30 days. Both are implemented, though no test exercises either refusal, and nothing on the demo path classifies a reply as declined, so the cooling rule has had nothing to act on yet. A third, already approached, is kept in the code but cannot fire today, because the unique constraint on (placement, market, stage) already allows only one approach. The send is deliberately outside that transaction: holding it open across a network call would quietly turn two workers into one.",
          "Because the claim also clears due_at, the headline test alone cannot tell the lock from the column. A second test forces two claim transactions to overlap before either commits; it was verified by hand to go red with the lock removed.",
        ],
      },
      {
        heading: "Where a model is allowed",
        paragraphs: [
          "Only in classifying an underwriter's reply into a closed set of five values, with abstention. The response type carries no identifier, state, permission or numeric field, so a model cannot express 'approach this carrier'. No live model has been called for this project; the shipped classifier is a declared stand-in.",
        ],
      },
    ],
    limitations: [
      "The n8n arm is measured through a simulator of its exported workflow, not a live n8n run; Retry On Fail, resuming after a Wait node and the HTTP transport are not modelled.",
      "One failure mode — overlapping scheduled executions — is proven; five others are analysed and labelled as analysed.",
      "The claim is at most one accepted approach per (placement, market, stage) under the tested contract, not exactly-once delivery.",
      "A scheduler that dies between claim and send strands that approach: it fails safe (not sent) and is recovered manually.",
      "The deployed board is seeded directly, so it shows a state rather than the mechanism reaching it; the mechanism is proven by the kill test in CI.",
      "No live model has been called: the reply classifier is a declared stand-in, and nothing on the deployed path calls it.",
    ],
    facts: [
      { label: "n8n workflow", value: "17 nodes, importable JSON" },
      { label: "Console tests", value: "23 Vitest tests" },
      { label: "Business identity", value: "(placement, market, stage)" },
    ],
    stack: [
      "Python 3.12",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL 16",
      "n8n",
      "Next.js 15",
      "TypeScript",
      "Vitest",
      "Docker",
      "Vercel",
      "Render",
      "Neon",
    ],
    skills: [
      "n8n",
      "Workflow orchestration",
      "Concurrency control",
      "SKIP LOCKED",
      "Idempotency",
      "Forced-interleaving tests",
    ],
    shots: [
      {
        src: "/shots/market-approach-desk/board.webp",
        width: 1600,
        height: 788,
        alt: "Placement board listing approaches by carrier with their state and seeded attempt count",
        caption: "The placement board, captured from the live deployment.",
        source: "live",
      },
      {
        src: "/shots/market-approach-desk/comparison.webp",
        width: 1600,
        height: 422,
        alt: "Kill-test panel of the comparison screen: the n8n arm observed two approaches with one duplicate, the Python arm one approach and no duplicate",
        caption: "The comparison screen's kill-test panel, rendered from the committed result of 2026-09-11: two approaches reached the fake carrier from the n8n arm, one from the Python arm. The Python arm's one-line summary on it refers to the two conflict rules described in the notes above.",
        source: "live",
      },
    ],
    githubUrl: "https://github.com/tair800/market-approach-desk",
    liveUrl: "https://market-approach-desk.vercel.app",
    backendUrl: "https://market-approach-desk-api.onrender.com/docs",
    backendLabel: "API docs",
  },
  {
    slug: "callsite-impact",
    index: 3,
    name: "Callsite Impact",
    short: "Callsite",
    domain: "API change analysis",
    tagline:
      "Which of our call sites actually break when a vendor ships a new API version — graded against the compiler.",
    identity: "callsite",
    status: { kind: "complete", label: "Complete · frozen", deployment: "Deployed / live" },
    flagship: false,
    summary:
      "Predicts which call sites break under an OpenAPI change, with compiler-verified labels as ground truth and a held-out slice frozen before it was scored.",
    problem:
      "A spec differ can report hundreds of breaking changes between two API versions but cannot say which of your call sites break — it compares documents and knows nothing about your code. Adyen BalancePlatform v1 → v2: 296 reported changes; the compiler breaks 33 of 133 call sites.",
    built:
      "A pipeline that generates call sites from revision A, keeps only those that compile, lets the TypeScript compiler label what breaks under revision B, and predicts those breakages from the oasdiff change set and a parsed view of the source — never from compiler output.",
    hardPart:
      "Keeping the author out of the answer key: the generator never sees revision B or the diff, a failing call site is discarded rather than repaired, and a guard fails the build if the classifier imports the oracle.",
    plain: {
      does: "Predicts which parts of an app will break when an outside service it relies on releases a new version of its API.",
      matters: "A tool that compares API documents can list hundreds of changes, but not which of them break your own code.",
      built: "Built a pipeline that writes calls against the old API, lets the compiler mark which break on the new one, and predicts them without seeing its answer.",
      result: "On the APIs it was developed on it scored 0.963 (F1); on APIs held back until the end, 0.328 — no false alarms, but only about one breakage in five caught. The second number is the honest one.",
      caveat: "On APIs it had not seen before, it raised no false alarms but caught only about one breakage in five.",
      tech: ["Python", "TypeScript", "OpenAPI", "Next.js"],
    },
    evidence: [
      {
        value: "0.963 → 0.328",
        label: "F1 score on the development corpus vs a slice held out and frozen before scoring; on unseen APIs it misses four breakages in five",
        note: "The development F1 is a post-selection number; the held-out one is the unbiased estimate.",
        tone: "fail",
        lead: true,
      },
      {
        value: "1.000",
        label: "held-out precision: zero false positives across 1,077 clean call sites",
        note: "At a held-out recall of 0.196.",
        tone: "pass",
      },
      {
        value: "94",
        label: "compiler-verified breakages across 3 vendors in the release corpus",
      },
      {
        value: "895",
        label: "call sites a naive 'changed operation' baseline flags to catch the same 94",
      },
    ],
    visual: {
      type: "split",
      columns: ["Development", "Held-out slice"],
      rows: [
        { label: "Spec pairs / vendors", values: ["18 / 3", "15 / 3"] },
        { label: "Admitted call sites", values: ["1,338", "1,342"] },
        { label: "Compiler-verified breakages", values: ["94", "265"] },
        { label: "Precision", values: ["0.958", "1.000"], tones: [null, "pass"] },
        { label: "Recall", values: ["0.968", "0.196"], tones: [null, "fail"] },
        { label: "F1", values: ["0.963", "0.328"], tones: [null, "fail"] },
      ],
      summary:
        "Frozen in git before it was measured, scored once, and nothing changed afterwards. On unseen services the system is never wrong when it speaks, and misses four breakages in five.",
      source: "README · held-out slice, frozen at 9378d58",
    },
    flow: {
      caption: "Neither the answer key nor the call sites it grades are written by a person.",
      lanes: [
        {
          title: "Ground truth",
          steps: [
            { label: "Vendor spec A", kind: "input" },
            { label: "Generate call sites", detail: "from revision A and a seed", kind: "deterministic" },
            { label: "tsc against A", detail: "admit only clean call sites", kind: "gate" },
            { label: "tsc against B", detail: "compiler labels = ground truth", kind: "store" },
          ],
        },
        {
          title: "System under test",
          steps: [
            { label: "Specs A + B", kind: "input" },
            { label: "oasdiff change set", kind: "deterministic" },
            { label: "Parsed call-site source", detail: "no type checker", kind: "deterministic" },
            { label: "Rule table", detail: "IMPACTED · UNAFFECTED · UNKNOWN", kind: "gate" },
          ],
        },
      ],
      note: "Verdicts are graded against the compiler's labels. The classification package is forbidden from importing the oracle.",
    },
    sections: [
      {
        heading: "Why it fails on unseen services, traced to one character",
        paragraphs: [
          "39% of the held-out misses are on operations the differ reported no change for at all. oasdiff normalises path-parameter names — {EmployeeId} and {EmployeeID} are the same endpoint to it — while openapi-typescript keys paths on the literal string, so every call site on that path breaks. The tool's recall is capped by the differ's recall, and the gap is silent.",
          "It is not fixed. Fixing it against the slice that revealed it would turn the only unbiased number in the repository into a second development number.",
        ],
      },
      {
        heading: "Three verdicts, and why the third is not a cop-out",
        paragraphs: [
          "UNKNOWN covers changes the type system cannot express — a decreased maxLength is a real breaking change, but no call site can be made to fail on it, so a clean compile is not evidence of safety. The abstention rate is published: 2.2% of (call site × change) pairs on development, 1.8% on the held-out slice.",
        ],
      },
      {
        heading: "A kill criterion sensitive to budget, and published that way",
        paragraphs: [
          "The predeclared criterion was at least 60 compiler-verified breakages across at least 3 vendors. At the harness default budget the same corpus yields 52 and fails; the canonical release budget yields 94 and passes. Both are published side by side, and F1 moves by 0.002 while the admitted corpus grows 2.3×, from 854 to 1,931 call sites.",
        ],
      },
    ],
    limitations: [
      "Held-out recall is 0.196: on unseen services the tool misses four breakages in five.",
      "The largest group of held-out misses (84 of 213) is on operations the differ reported no change for; the cause found, path-parameter renames it normalises away, is deliberately not fixed against the spent slice.",
      "The kill-criterion count depends on the generation budget; the predictive metrics do not.",
      "No model is used anywhere, and no retrieval layer was built.",
    ],
    facts: [
      { label: "Vendors", value: "Adyen, Twilio, Xero — MIT-licensed specs" },
      { label: "Release corpus", value: "18 revision pairs, 1,338 call sites" },
      { label: "Abstention", value: "2.2% of (call site × change) pairs; 1.8% held out" },
    ],
    stack: [
      "Python 3.12",
      "TypeScript compiler",
      "openapi-typescript",
      "oasdiff",
      "FastAPI (local, read-only)",
      "Next.js 15",
      "Vercel",
    ],
    skills: [
      "API change-impact analysis",
      "OpenAPI",
      "Evaluation design",
      "Held-out testing",
      "Static analysis",
    ],
    shots: [
      {
        src: "/shots/callsite-impact/result.webp",
        width: 1500,
        height: 940,
        alt: "The measured result page comparing development and held-out scores",
        caption: "The measured result, including the held-out slice — captured from the deployed site.",
        source: "live",
      },
      {
        src: "/shots/callsite-impact/verdicts.webp",
        width: 1190,
        height: 640,
        alt: "Table of call sites with the compiler, system and baseline verdicts side by side",
        caption: "The compiler, the system and the baseline on the same call sites.",
        source: "live",
      },
    ],
    githubUrl: "https://github.com/tair800/callsite-impact",
    liveUrl: "https://callsite-impact.vercel.app",
  },
  {
    slug: "agent-authz-broker",
    index: 4,
    name: "Agent Authorization Broker",
    short: "Authz Broker",
    domain: "AI agent security",
    tagline: "An agent can request an action. It cannot manufacture the authority to perform one.",
    identity: "authz",
    status: { kind: "complete", label: "Complete · frozen", deployment: "Deployed / live" },
    flagship: true,
    summary:
      "An MCP resource server that computes an agent's authority from the token's audience, the whole delegation chain and an approval it looks up itself — granted with an approver credential the agent cannot hold — and lets each approval authorise at most one effect.",
    problem:
      "A validly signed agent token is not authorisation. It might have been minted for another service, claim a scope the delegating human never had, or ask for something irreversible that nobody approved. A resource server that checks the signature and stops has caught none of these.",
    built:
      "An MCP server over Streamable HTTP that checks the audience, computes the effective scope as the intersection down the whole delegation chain, and allows an irreversible tool only against an approval bound to subject, tool, account, amount and expiry — consumed by a conditional UPDATE behind a UNIQUE constraint.",
    hardPart:
      "Proving each control is load-bearing: every one was removed in turn and the suite went red. Later reviews found holes no test covered — an unauthenticated approval endpoint and refusals at the transport that left no audit row — and both were fixed and published.",
    plain: {
      does: "Controls which actions an AI agent may perform, and blocks anything irreversible until someone other than the agent has approved it.",
      matters: "A valid-looking agent credential can still be meant for another service, claim more permission than it was given, or ask for an action nobody approved.",
      built: "Built a gatekeeper that checks each request against the agent's real permissions and lets every approval be used only once.",
      result: "None of the 5 attack scenarios got through the hardened server, against 2 of 5 for a basic token check, and each of 12 deliberately planted breaches made the tests fail.",
      figure: { value: "0 of 5", label: "test attacks got through, where a basic security check let 2 through" },
      tech: ["Python", "MCP", "FastAPI", "PostgreSQL"],
    },
    evidence: [
      {
        value: "0 of 5",
        label: "attacks that got past the hardened server; a naive verifier that takes the token's own scope claim at its word let 2 of 5 through",
        tone: "pass",
        lead: true,
      },
      {
        value: "4 → 2",
        label: "irreversible effects across six scenarios, naive → hardened; both remaining are required",
      },
      {
        value: "12 / 12",
        label: "deliberately planted breaches — in the security checks, the audit trail, the rate limit and the test harness itself — each caught by the tests, replayed in CI",
        tone: "pass",
      },
      {
        value: "12",
        label: "security scenarios run against the public deployment with a real MCP client, effects counted in PostgreSQL — one committed run",
      },
    ],
    visual: {
      type: "authz",
      rows: [
        {
          scenario: "Correct audience, attenuated scope, matching approval",
          naive: "allowed",
          hardened: "allowed",
          effects: [1, 1],
          attack: false,
        },
        {
          scenario: "Valid token minted for another resource server",
          naive: "allowed",
          hardened: "denied · audience_mismatch",
          effects: [1, 0],
          attack: true,
        },
        {
          scenario: "Delegated token claims a scope its delegator lacked",
          naive: "allowed",
          hardened: "denied · insufficient_effective_scope",
          effects: [1, 0],
          attack: true,
        },
        {
          scenario: "Irreversible tool, no recorded approval",
          naive: "denied",
          hardened: "denied · approval_required",
          effects: [0, 0],
          attack: true,
        },
        {
          scenario: "Expired approval",
          naive: "denied",
          hardened: "denied · approval_expired",
          effects: [0, 0],
          attack: true,
        },
        {
          scenario: "One approval, two calls",
          naive: "denied on the 2nd",
          hardened: "denied on the 2nd",
          effects: [1, 1],
          attack: true,
        },
      ],
      summary:
        "The naive verifier checks signature and expiry and takes the leaf's scope claim at its word. Every effect count is SELECT count(*) FROM irreversible_effect from a clean database, and both verifiers share one approval layer, so they can only differ where the difference is a token check.",
      source: "artifacts/matrix.json, re-measured by CI on every push to main and every pull request",
    },
    flow: {
      caption: "Authority is computed by the server, never accepted from the caller.",
      lanes: [
        {
          steps: [
            { label: "Agent + bearer token", kind: "input" },
            { label: "MCP transport", detail: "Streamable HTTP", kind: "deterministic" },
            { label: "Signature, expiry, audience", detail: "JWKS · another service's token is refused before any tool runs", kind: "gate" },
            { label: "Effective scope", detail: "leaf ∩ … ∩ root of the delegation chain", kind: "gate" },
            { label: "Approval lookup", detail: "server-side; no tool argument can assert one", kind: "gate" },
            { label: "Consume once", detail: "conditional UPDATE + UNIQUE", kind: "store" },
            { label: "Irreversible effect", kind: "effect" },
          ],
        },
      ],
      note: "Authorisation decisions are audited, including tokens refused at the transport before any tool is routed. Approvals are granted over a separate endpoint that requires an approver credential the agent cannot obtain — a shared credential, not a person's identity.",
    },
    sections: [
      {
        heading: "Three checks a signature check cannot do",
        paragraphs: [
          "Audience: a token the agent legitimately holds for another service is refused before any tool runs. Attenuation: the effective scope is the intersection of every link in the delegation chain, so a scope missing from a middle link is missing from the result. Approval: the irreversible tool's input schema is exactly {account, amount} — there is no field a caller can use to assert approval — and the server finds the approval itself.",
          "One approval authorises at most one effect because of two things enforced by PostgreSQL rather than by Python: a conditional UPDATE that only one statement can match, and a UNIQUE constraint on the effect's approval id. An in-process lock would pass a concurrency test and fail behind two workers, so there is none.",
        ],
      },
      {
        heading: "Twelve breaches planted, twelve caught",
        paragraphs: [
          "Each control was removed in turn and the suite re-run; make breaches replays all twelve against a checkout and CI runs it. The informative one: removing the application-level consume guard did not produce a wrong answer — it produced a constraint violation. The database refused the second effect on its own.",
          "A later review attacked a running copy and found two holes: the approval-granting endpoint was unauthenticated, so an agent could create the approval it then spent, and transport-level refusals wrote no audit row. A third review found the container entrypoint called a module that never existed. All are recorded and fixed.",
        ],
      },
      {
        heading: "Deploying found what local testing could not",
        paragraphs: [
          "The MCP SDK's DNS-rebinding protection permits localhost only unless given an allowlist, so the first live instance answered 421 to every client while every local suite passed. A committed smoke run then exercised twelve scenarios against the public endpoint with a real MCP client, and the server publishes RFC 9728 protected-resource metadata.",
        ],
      },
    ],
    limitations: [
      "The approval endpoint authenticates a shared credential, not a person; approved_by is a string its holder supplies.",
      "It is a resource server, not an authorisation server: a test authority mints real Ed25519 tokens and is otherwise not an IdP.",
      "A stolen, still-valid token is not detected. The design limits it to the attenuated scope and stops irreversible action without approval — but a thief acting between a human approving and the agent acting spends that approval.",
      "The rate limit is a ceiling, not DDoS protection, and not part of the security claim; with fixed windows the worst case across an arbitrary minute is twice the limit.",
      "The demo token mint is open on non-production instances so anyone can drive the lab; an anonymous visitor holding every one of those tokens still cannot cause an irreversible effect.",
      "The console renders the committed measurement, not the live broker, and the free-tier server sleeps: the first request after idle can take about a minute.",
      "Not built: a Keycloak gap analysis, OpenTelemetry/Langfuse, step-up authorisation, CIMD-vs-DCR, and the full RFC 9728/8707/9207 conformance suites.",
      "Everything is synthetic: invented accounts, no payment rail; the irreversible effect is a row in a demonstration table.",
    ],
    facts: [
      { label: "MCP protocol", value: "2025-11-25, Streamable HTTP" },
      { label: "Tokens", value: "Ed25519, verified against a JWKS" },
      { label: "Tests", value: "Offline and real-PostgreSQL suites · six CI jobs" },
      { label: "Rate limit", value: "per subject and tool, counted in PostgreSQL" },
    ],
    stack: [
      "Python",
      "MCP SDK",
      "FastAPI",
      "PostgreSQL 16",
      "SQLAlchemy",
      "Alembic",
      "asyncpg",
      "PyJWT",
      "cryptography (Ed25519, JWKS)",
      "Next.js 15",
      "Docker",
      "GitHub Actions",
      "Render",
      "Neon",
      "Vercel",
    ],
    skills: [
      "MCP",
      "AI agent security",
      "Authorisation",
      "JWT / JWKS",
      "Approval gating",
      "One-time approval consumption",
      "Concurrency control",
      "Rate limiting",
    ],
    shots: [
      {
        src: "/shots/agent-authz-broker/matrix.webp",
        width: 1500,
        height: 1500,
        alt: "Security matrix comparing the naive baseline and the hardened server for each scenario",
        caption: "The security matrix, rendered from the committed measurement run, including the totals row.",
        source: "repo",
      },
      {
        src: "/shots/agent-authz-broker/chain.webp",
        width: 1500,
        height: 1000,
        alt: "Delegation chain view showing scopes at each link and the computed effective scope",
        caption: "Delegation and attenuation: the effective scope is the intersection down the chain.",
        source: "repo",
      },
      {
        src: "/shots/agent-authz-broker/approvals.webp",
        width: 1500,
        height: 760,
        alt: "Approvals table: approvals bound to agent, tool, account and amount, in consumed, pending and expired states",
        caption: "Approvals: each binds one tool call to an account and an amount, and can be spent at most once.",
        source: "repo",
      },
    ],
    githubUrl: "https://github.com/tair800/agent-authz-broker",
    liveUrl: "https://agent-authz-broker.vercel.app",
    backendUrl: "https://agent-authz-broker.onrender.com/.well-known/oauth-protected-resource/mcp",
    backendLabel: "MCP metadata",
  },
  {
    slug: "counterparty-resolver",
    index: 5,
    name: "Counterparty Resolver",
    short: "Resolver",
    domain: "Entity resolution",
    tagline:
      "Do two records refer to the same real-world counterparty? Evaluated against duplicates a registrar adjudicated.",
    identity: "resolver",
    status: { kind: "complete", label: "Complete · frozen", deployment: "Deployed / live" },
    flagship: false,
    summary:
      "Entity resolution with deterministic rules over interpretable features, a human approving every merge, and a merge ledger that reverses to the byte — evaluated on real GLEIF adjudications.",
    problem:
      "A wrong merge corrupts payment routing for days; a missed duplicate costs a duplicate. So the positive labels here are not the author's: they are duplicate adjudications recorded by LEI Issuing Organisations before this project existed.",
    built:
      "A resolution layer over fixed legacy schemas that may not change: deterministic blocking, ordered rules that decide MATCH, REVIEW or NO_MATCH, human approval of every merge, and an append-only merge ledger that reverses to the byte — evaluated on registrar duplicate adjudications from the public GLEIF dataset, the only data the corpus and the live demo hold.",
    hardPart:
      "Brownfield constraints: the source schemas may not change, so everything is additive — including an expand, backfill and contract migration that refuses to drop a column while any row would lose its approver.",
    plain: {
      does: "Decides whether two company records describe the same business, and leaves every merge for a person to approve.",
      matters: "Wrongly merging two companies corrupts where payments go, and missing a duplicate leaves the same company on file twice.",
      built: "Built clear, explainable matching rules over public company-registry data, a person approving every merge, and a merge history that can be undone exactly.",
      result: "Precision of 0.9980 on 10,532 development pairs — six false merges against seven for the best baseline — though a simple nine-line rule still scores higher overall (F1 0.7607 against 0.7303).",
      tech: ["Python", "FastAPI", "SQLite", "Docker"],
    },
    evidence: [
      {
        value: "0.9980",
        label: "precision over 10,532 development pairs — six false merges, against seven for the best baseline; on F1 the nine-line identifier_first baseline still wins, 0.7607 to 0.7303",
        note: "Held out: 0.9986 with one false merge, or 0.9972 with development-only priors. The project quotes the development figure: the hold-out's negatives are easier, so its absolute precision is not comparable.",
        tone: "pass",
        lead: true,
      },
      {
        value: "< 0.005",
        label: "movement of the system's precision, recall and F1 between development and the hold-out",
      },
      {
        value: "12,984",
        label: "labelled pairs: GLEIF duplicate adjudications plus mined hard negatives",
      },
      {
        value: "0.9138",
        label: "candidate recall at a 0.9955 reduction ratio",
        note: "Measured over a record pool made up of known duplicates; a real master file would give a different ratio.",
      },
    ],
    visual: {
      type: "bars",
      title: "Held-out precision and F1, against the three predeclared baselines",
      series: ["Precision", "F1"],
      rows: [
        { label: "exact_normalized_name", values: [0.9967, 0.6572] },
        { label: "fuzzy_name_only_0.90", values: [0.889, 0.7488] },
        { label: "identifier_first", values: [0.9817, 0.7538] },
        { label: "system", values: [0.9986, 0.7344], highlight: true },
      ],
      max: 1,
      format: "fixed4",
      summary:
        "The kill test was predeclared on precision, and the system wins there. On F1, identifier_first and the fuzzy baseline both score higher; the project publishes both, and notes that the fuzzy row is not a fair measurement.",
      source: "artifacts/evaluation.json · hold-out scored once at b67b83e",
    },
    flow: {
      caption: "What a registrar wrote is read first; what two strings look like is read afterwards.",
      lanes: [
        {
          steps: [
            { label: "GLEIF records", detail: "fixed legacy schema, read through a view", kind: "input" },
            { label: "Blocking", detail: "candidate reduction", kind: "deterministic" },
            { label: "Registrar number", detail: "same authority and number, on at most two records → MATCH", kind: "gate" },
            { label: "Series / vintage designator", detail: "differing designator → two products", kind: "gate" },
            { label: "Weighted features", detail: "decides REVIEW or NO_MATCH — never MATCH", kind: "deterministic" },
            { label: "Human approval", kind: "human" },
            { label: "Append-only merge ledger", detail: "reversible, including source links", kind: "store" },
          ],
        },
      ],
      note: "No model is in the decision path. Exact agreement of the whole canonicalised name also yields MATCH.",
    },
    sections: [
      {
        heading: "Positive labels nobody here wrote",
        paragraphs: [
          "The labels are duplicate adjudications recorded by LEI Issuing Organisations in the public GLEIF dataset (CC0), paired with an equal number of similarity-mined hard negatives. The split is by entity cluster, not by pair, so no entity appears on both sides. The entity split was committed before any rule existed; the hold-out's negatives were later redrawn within the held-out side, and the hold-out was scored once.",
        ],
      },
      {
        heading: "Why the weighted score never asserts a match",
        paragraphs: [
          "A MATCH band at 0.86 decided 234 development pairs, 83 of them wrongly — a rule wrong a third of the time is a queue, not an auto-merge. Removing the band cost 0.029 recall and removed 83 of 89 false merges. The whole sweep is published so the choice is auditable.",
          "An identifier only counts when it identifies: every Allianz fund at one registration authority shared a single number, and the first rule merged a small-cap equity fund with a bond fund — 40 false merges — until agreement required the number to appear on at most two records.",
        ],
      },
      {
        heading: "A merge ledger that can be unpicked",
        paragraphs: [
          "Append-only in the database, enforced by triggers that refuse UPDATE and DELETE. Idempotent on a unique key, so a retry after a timeout is one merge. The unmerge test compares every table except the ledger itself — which must hold exactly the merge and its reversal — before the merge and after the reversal, because asserting that the resolved entity disappeared would pass while leaving source links pointing nowhere.",
        ],
      },
    ],
    limitations: [
      "identifier_first beats the system on F1: 0.7607 against 0.7303 on development.",
      "The precision margin over the best baseline, exact_normalized_name, is one false merge — six against seven on development.",
      "The hold-out's negatives are measurably easier than development's, so its absolute precision is not comparable.",
      "Prior names are carried but not consulted: 324 missed development duplicates have an exact alias match.",
      "The REVIEW band is measured but not adjudicated by a model, so no cost comparison between arms is published.",
      "The live demo is read-only: every write is refused with 403, so a merge cannot be approved there.",
    ],
    facts: [
      { label: "Records", value: "12,853" },
      { label: "Review band", value: "21.2% of development pairs handed to a person" },
      { label: "Planted breaches", value: "25 guards, each planted and caught" },
    ],
    stack: ["Python", "FastAPI", "SQLite", "rapidfuzz", "GLEIF (CC0)", "Docker", "Render"],
    skills: [
      "Entity resolution",
      "Evaluation vs baselines",
      "Brownfield migration",
      "Append-only ledger",
      "Human approval",
    ],
    shots: [
      {
        src: "/shots/counterparty-resolver/pair.webp",
        darkSrc: "/shots/counterparty-resolver/pair-dark.webp",
        width: 1180,
        height: 900,
        alt: "Pair evidence screen listing every feature, what it compared and what it contributed",
        caption: "One pair: every feature, what it compared, and what it contributed.",
        source: "live",
      },
      {
        src: "/shots/counterparty-resolver/queue.webp",
        darkSrc: "/shots/counterparty-resolver/queue-dark.webp",
        width: 1180,
        height: 900,
        alt: "Review queue of pairs the resolver declined to decide, highest score first",
        caption: "The review queue: what the resolver declined to decide, highest score first.",
        source: "live",
      },
    ],
    githubUrl: "https://github.com/tair800/counterparty-resolver",
    liveUrl: "https://counterparty-resolver.onrender.com",
    demoNote: "Free demo — may take ~1 min to wake.",
  },
  {
    slug: "bordereaux-reconciler",
    index: 6,
    name: "Bordereaux Reconciler",
    short: "Bordereaux",
    domain: "Insurance reconciliation",
    tagline:
      "Delegated-authority bordereaux reconciled against a carrier ledger, with exact decimal money and cell-level lineage.",
    identity: "bordereaux",
    status: { kind: "complete", label: "Complete · frozen", deployment: "Deployed / live on Render" },
    flagship: true,
    summary:
      "Insurance reconciliation where every canonical value carries the spreadsheet cell it came from, money is exact decimal throughout, and the one role a model is allowed — proposing a column mapping — is built but not wired in.",
    problem:
      "Coverholders send monthly bordereaux with no standard: one writes Gross Premium, another GWP (excl IPT), a third Total Payable and means something else. 1,234.56 and 1.234,56 are the same number written by different people and different numbers read by the wrong parser. Someone reconciles this by hand, and the errors that matter do not look wrong.",
    built:
      "Ingestion under conventions the coverholder declares, column mapping from the header and the shape of the values beneath it, canonicalisation to exact decimals with the source cell attached to every value, reconciliation into six statuses, a human-confirmation step for mappings, and Terraform for Azure that passes terraform validate in CI and has never been applied.",
    hardPart:
      "Mapping headers nobody wrote down. Each column is profiled — share of amounts, dates, identifiers, closed vocabularies, magnitude rank among the money columns — and that evidence is combined with the header, so the mapping holds where header-string methods collapse.",
    plain: {
      does: "Checks the monthly spreadsheets insurance partners send against the insurer's ledger, traces every figure to its source cell, and flags unclear rows for review.",
      matters: "Partners use different column names and number formats, and the errors that matter most do not look wrong.",
      built: "Built an engine that works out each spreadsheet's layout on its own, keeps money exact, and gives every row a clear outcome.",
      result: "Not one row was wrongly marked as matching in a held-back test set of 715 rows with 90 planted errors, and every row got exactly the status the answer key expected.",
      figure: { value: "0", label: "false matches in a separate 715-row test set with 90 planted errors — every row got the right result" },
      tech: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    },
    evidence: [
      {
        value: "0",
        label: "rows wrongly marked MATCHED in a frozen hold-out of 715 rows seeded with 90 discrepancies",
        tone: "pass",
        lead: true,
      },
      {
        value: "0.913",
        label: "column-mapping accuracy on the hold-out files; the best of four header-matching baselines reaches 0.652",
        note: "Hold-out numbers were visible in debug output before scoring, so the project treats this figure as slightly weaker; the development figure is also 0.913.",
        tone: "pass",
      },
      {
        value: "13,718",
        label: "canonical cells traced to their source cell — 0 incomplete",
      },
      {
        value: "19 / 19",
        label: "planted defects caught",
        tone: "pass",
      },
    ],
    visual: {
      type: "bars",
      title: "Column-mapping accuracy against four predeclared header-string baselines",
      series: ["Hold-out", "Development"],
      rows: [
        { label: "value shape + header (system)", values: [0.913, 0.913], highlight: true },
        { label: "curated synonyms", values: [0.6522, 0.837] },
        { label: "fuzzy header", values: [0.6304, 0.7065] },
        { label: "normalised header", values: [0.5217, 0.6196] },
        { label: "exact header", values: [0.3478, 0.3261] },
      ],
      max: 1,
      format: "fixed3",
      summary:
        "The margin is wider on the hold-out (+0.26) than on development (+0.08): the hold-out carries the unseen-vocabulary variants, where header-string methods collapse and value-shape evidence does not.",
      source: "artifacts/ · graded by a kill test committed before implementation",
    },
    flow: {
      caption: "A row that cannot be read exactly is quarantined, never coerced.",
      lanes: [
        {
          steps: [
            { label: "Coverholder file", detail: "CSV or XLSX · declared decimal and date conventions", kind: "input" },
            { label: "Column profiling", detail: "value shape + header evidence", kind: "deterministic" },
            { label: "Column mapping", detail: "deterministic mapper · a model port may only name canonical fields, not wired in", kind: "deterministic" },
            { label: "Mapping confirmed", detail: "a person confirms · the demo's mappings are seeded", kind: "human" },
            { label: "Canonicalise", detail: "exact Decimal + source cell on every value", kind: "deterministic" },
            { label: "PostgreSQL ledger", detail: "canonical rows · NUMERIC(18, 4) · lineage", kind: "store" },
            { label: "Reconcile vs carrier ledger", detail: "six statuses", kind: "gate" },
          ],
        },
      ],
      branches: [
        {
          label: "Cannot be read exactly",
          steps: [{ label: "Quarantine queue", detail: "a queue, not a bin", kind: "human" }],
        },
      ],
      note: "Statuses: MATCHED, MISMATCH, MISSING, DUPLICATE, AMBIGUOUS, REVIEW. MATCHED is constructed in exactly one place in reconcile.py, and a test asserts it over the module's syntax tree.",
    },
    sections: [
      {
        heading: "Exact money, enforced at runtime",
        paragraphs: [
          "No premium, deduction or ledger amount is stored, parsed or compared as a float. The money module raises on a float at runtime rather than trusting the type checker, money columns in PostgreSQL are NUMERIC(18, 4), deductions are stored in JSON as strings, and rounding is half away from zero because that is what the finance systems a coverholder uses do.",
          "Tolerances are configuration: a tolerance names the fields it covers, and a field it does not name requires exact agreement. No model, heuristic or scoring function can influence one.",
        ],
      },
      {
        heading: "Where the model is allowed to be",
        paragraphs: [
          "A model is confined to one permitted role: proposing a mapping from source columns to canonical fields, for a person to confirm. That port is built and tested but not wired in — the deterministic mapper produces every mapping. The proposal type has no field capable of holding money, the reconciler does not import the provider, and every proposal is validated against the canonical field set before a human sees it. A spreadsheet cell reading 'ignore previous instructions' is inert because a proposal can only name a field from a closed set.",
        ],
      },
      {
        heading: "Infrastructure as code, validated and not applied",
        paragraphs: [
          "Terraform composes a platform module into three environment roots — dev, bench and prod — declaring Azure Container Apps, Azure Database for PostgreSQL and keyless Blob storage that would hold the raw spreadsheets behind every lineage record. All three pass terraform validate against the real azurerm 5.6.0 schema in CI, and a committed residency manifest must match the Terraform inputs.",
          "Nothing has been applied: there is no Azure subscription for this build, and the live demo runs on Render's free tier.",
        ],
      },
    ],
    limitations: [
      "No Azure deployment exists: the Terraform is validated in CI and has never been applied.",
      "No live model call: the port, validation boundary and residency record are built and tested, but no live arm is wired in and no key exists, so no cost or latency is published.",
      "Hold-out numbers were visible in debug output before the scoring run (0.7826). The repository discloses every change made in between and asks sceptical readers to treat the hold-out figure as slightly weaker.",
      "Two development variants, multi-commission and split-tax layouts, get REVIEW instead of a decision: the adapter they need is not built.",
      "The demo's free Render PostgreSQL expires on 24 October 2026; after that only the evidence page keeps working unless the database is re-provisioned.",
      "The corpus is synthetic, generated from a committed seed; no redistributable real bordereaux exist.",
    ],
    facts: [
      { label: "Corpus", value: "18 schema variants · 2,333 canonical rows" },
      { label: "Re-ingestion", value: "16 files × 3, 0 second versions" },
      { label: "Portability", value: "725 non-insurance rows through the same engine" },
      { label: "CI", value: "fast · terraform · evidence · falsifiability · docker" },
    ],
    stack: [
      "Python 3.12",
      "FastAPI",
      "PostgreSQL 16",
      "SQLAlchemy",
      "Alembic",
      "openpyxl",
      "Terraform",
      "Azure — validated, never applied",
      "Docker",
      "GitHub Actions",
      "Render",
    ],
    skills: [
      "Insurance reconciliation",
      "Deterministic money",
      "Data lineage",
      "Human-confirmed mapping",
      "Terraform / IaC",
      "Residency manifest as code",
    ],
    shots: [
      {
        src: "/shots/bordereaux-reconciler/overview.webp",
        darkSrc: "/shots/bordereaux-reconciler/overview-dark.webp",
        width: 1280,
        height: 800,
        alt: "Overview screen with the false-MATCHED banner reading zero and ingestion counters",
        caption: "The overview: the false-MATCHED banner renders whether the count is zero or not.",
        source: "live",
      },
      {
        src: "/shots/bordereaux-reconciler/row-lineage.webp",
        darkSrc: "/shots/bordereaux-reconciler/row-lineage-dark.webp",
        width: 1280,
        height: 1000,
        alt: "Row lineage screen tracing each canonical value to its sheet, row and source header",
        caption: "Lineage: every value traced to the cell it came from.",
        source: "live",
      },
      {
        src: "/shots/bordereaux-reconciler/evidence.webp",
        darkSrc: "/shots/bordereaux-reconciler/evidence-dark.webp",
        width: 1280,
        height: 1380,
        alt: "Evidence screen listing each published figure with the artifact that produced it",
        caption: "Evidence: every figure traced to the artifact that produced it.",
        source: "live",
      },
    ],
    githubUrl: "https://github.com/tair800/bordereaux-reconciler",
    liveUrl: "https://bordereaux-reconciler.onrender.com",
    demoNote: "Free demo — may take ~1 min to wake.",
  },
  {
    slug: "parts-answer-gate",
    index: 7,
    name: "Parts Answer Gate",
    short: "Parts Gate",
    domain: "Retrieval (RAG)",
    tagline:
      "Effectivity-aware retrieval with citations, whose own pre-registered release gate failed — and is published as failed.",
    identity: "parts",
    status: {
      kind: "negative-result",
      label: "Closed — pre-registered negative result",
      deployment: "Deployed / live",
    },
    flagship: false,
    summary:
      "A bitemporal RAG system for maintenance technicians: variant, serial and validity are filtered in SQL before anything is ranked. Four of its twelve pre-registered kill conditions failed, and the project is published as that.",
    problem:
      "A technician needs the procedure in force for their exact machine variant and serial on a given date. A retriever with no effectivity constraint can quote a superseded revision or another variant's value verbatim — a confident, well-cited, wrong answer — and filtering a ranked list afterwards silently answers from whatever survives.",
    built:
      "Hybrid BM25 and pgvector retrieval with variant, serial, validity and knowledge-time predicates in the SQL WHERE clause of both ranking queries; a gate of seven deterministic signals that answers, abstains or sends to review; extractive answers with verbatim citations at character offsets; in English, Turkish and Russian.",
    hardPart:
      "Bitemporality. For example, a correction issued in 2025 about a 2021 procedure is valid in 2021 and known from 2025. Asked what the technician had in front of them at the time, the system returns the belief a later correction replaced — without rewriting it.",
    plain: {
      does: "Answers technicians' questions from maintenance manuals, quoting the exact passage that applies to their machine on a given date.",
      matters: "An answer taken from an outdated manual or the wrong machine variant can look confident, cite a real document and still be wrong.",
      built: "Built search that filters by machine, serial number and date before ranking, a gate that can refuse to answer, and word-for-word answers with citations.",
      result: "It never returned an outdated or wrong-variant passage in 600 replayed queries (120 questions, each at 5 dates), but 4 of its 12 release criteria, fixed in advance, failed — a fifth passed only trivially — so it is published as a negative result.",
      caveat: "It failed 4 of the 12 release tests set in advance, so it was closed rather than presented as a success.",
      tech: ["Python", "PostgreSQL", "pgvector", "FastAPI"],
    },
    evidence: [
      {
        value: "4 of 12",
        label: "release criteria, fixed before any source file existed, that failed — E, F, I and K; none was lowered, removed or disabled afterwards",
        note: "A fifth, G, passes near-vacuously: for 297 of 312 hold-out questions the effectivity filter leaves the gate nothing to catch.",
        tone: "fail",
        lead: true,
      },
      {
        value: "0",
        label: "superseded passages returned across 600 date-specific queries (120 questions at 5 dates)",
        tone: "pass",
      },
      {
        value: "0 / 3,669",
        label: "cited spans absent from the document they name",
        tone: "pass",
      },
      {
        value: "0.0047",
        label: "hold-out wrong-answer rate gated, against 0.0481 ungated",
        note: "Both come from the 15 hold-out questions about a family the corpus does not contain — the one class where the effectivity filter cannot help. Gated: a single wrong answer. G is near-vacuous for this reason.",
      },
    ],
    visual: {
      type: "killgrid",
      conditions: [
        { id: "A", label: "No superseded chunk for an as-of query", verdict: "pass" },
        { id: "B", label: "No other variant's chunk", verdict: "pass" },
        { id: "C", label: "No part number the evidence lacks", verdict: "pass" },
        { id: "D", label: "No cited span absent from its document", verdict: "pass" },
        { id: "E", label: "The gate refuses unsupportable questions", verdict: "fail" },
        { id: "F", label: "Hold-out recall@10 ≥ 0.85 and above every baseline", verdict: "fail" },
        { id: "G", label: "Hold-out wrong-answer rate ≤ 0.02", verdict: "near-vacuous" },
        { id: "H", label: "Ungated wrong answers ≥ 5× the gated rate", verdict: "pass" },
        { id: "I", label: "Abstention on the unanswerable set ≥ 0.90", verdict: "fail" },
        { id: "J", label: "Two runs agree byte for byte", verdict: "pass" },
        { id: "K", label: "Vector retrieval executes through pgvector", verdict: "fail" },
        { id: "L", label: "No document appears in both splits", verdict: "pass" },
      ],
      summary:
        "Thresholds fixed before any source file existed. G passes near-vacuously: for 297 of 312 hold-out questions the effectivity filter excludes, upstream of the gate, every passage that could make an answer wrong. The engineering is finished and deployed; the experiment's result is negative.",
      source: "README · generated from the graded kill test",
    },
    flow: {
      caption: "A passage outside the asked-for variant, serial range or in-force window is never scored at all.",
      lanes: [
        {
          steps: [
            { label: "Question", detail: "as_of · known_as_of · variant · serial · language", kind: "input" },
            { label: "Effectivity filter in SQL", detail: "WHERE clause of both ranking queries", kind: "deterministic" },
            { label: "Hybrid ranking", detail: "BM25 + pgvector", kind: "deterministic" },
            { label: "Gate", detail: "seven deterministic signals · no model output", kind: "gate" },
            { label: "Extractive answer", detail: "verbatim spans at character offsets", kind: "effect" },
          ],
        },
      ],
      branches: [
        {
          label: "Gate withholds",
          alternatives: true,
          steps: [
            { label: "ABSTAIN", detail: "carries no approved evidence", kind: "gate" },
            { label: "REVIEW", detail: "for example, two in-force sources disagree", kind: "human" },
          ],
        },
      ],
    },
    sections: [
      {
        heading: "Why it failed, and one root cause under most of it",
        paragraphs: [
          "E and I are the gate over-covering: term coverage uses a bidirectional prefix match that errs towards covering. It refuses 44 of 45 questions about a product family that does not exist, but only 17 of 45 where the product exists and the attribute does not. F, G, H and K share a cause: the criteria were written as if the effectivity filter sat beside the thing being measured, when it sits upstream of everything.",
          "The filter shrinks the candidate set to about 21 rows, for which PostgreSQL's planner uses the effectivity index rather than the vector index, so K cannot hold. On the hold-out the system's recall@10 of 0.9259 ties bm25_only and trails dense_only at 0.9352, so F fails. The failures stand as scored; the three corrections made after the first hold-out score are recorded in the decision log.",
        ],
      },
      {
        heading: "What worked, and is published",
        paragraphs: [
          "Effectivity filtered in SQL before ranking held in every replayed query: no superseded or wrong-variant passage over 600 queries (120 questions at 5 dates). The second temporal axis works: a historical knowledge query returns the belief a correction replaced. No ungrounded part number over 734 answers, no unfaithful span over 3,669 citations, and ten of ten planted breaches caught.",
          "The live deployment is checked over HTTP by a committed script: seven cases, including one question at a single validity date that cites the original revision under earlier knowledge and its correction under current knowledge. The deployed database is read out of its own catalog: PostgreSQL 16.15, pgvector 0.8.0, and an HNSW index over 12,420 embedded chunk rows — 4,140 chunks in three languages.",
        ],
      },
      {
        heading: "Two benchmark iterations, both kept in git",
        paragraphs: [
          "The first benchmark was fully scored and then found not to be a valid retrieval test: after filtering, the median hold-out question left 9 eligible passages against top-k 10, so ranking could not change recall. It is recorded, unsquashed. The second iteration rebuilt the corpus on distinct content — 14 families, 31 variants, 84 documents, 4,140 chunks — leaving a median of 21 eligible passages and 0% at or below top-k.",
        ],
      },
    ],
    limitations: [
      "Four of twelve pre-registered kill conditions fail (E, F, I, K); G passes near-vacuously.",
      "Three corrections were made after the second hold-out's first score. One re-froze it with 15 more unanswerable questions, which made G and H measurable and made I fail; the project asks readers to read that commit sceptically.",
      "No native speaker reviewed the corpus and no LLM judge was used: the multilingual result measures retrieval and gating over synthetic parallel text.",
      "The public instance serves query vectors computed at build time, because the multilingual encoder measured 671 MB resident against the free tier's 512 MB; free text outside the corpus is refused with an explanation.",
      "The managed-vector comparison used a local Qdrant container; Qdrant Cloud was never reached.",
      "The abstractive arm raises; no cost, latency or quality figure is published for any live model.",
    ],
    facts: [
      { label: "Corpus", value: "14 families · 31 variants · 84 documents · 4,140 chunks" },
      { label: "Languages", value: "EN / TR / RU, reported separately" },
      { label: "Planted breaches", value: "10 of 10 caught" },
      { label: "Encoder", value: "paraphrase-multilingual-MiniLM-L12-v2" },
    ],
    stack: [
      "Python 3.12",
      "FastAPI",
      "PostgreSQL 16",
      "pgvector",
      "BM25",
      "fastembed",
      "Neon",
      "Docker",
      "Render",
    ],
    skills: [
      "RAG",
      "pgvector",
      "Hybrid retrieval",
      "Embeddings",
      "Citations",
      "Bitemporal data",
      "Pre-registered evaluation",
    ],
    shots: [
      {
        src: "/shots/parts-answer-gate/answered.webp",
        width: 1600,
        height: 1194,
        alt: "An answered question: the extracted span and the first citation row, under the release-gate failure banner",
        caption: "An answered question: the extracted span and the first of its citations, under the release-gate failure banner that heads every page.",
        source: "live",
      },
      {
        src: "/shots/parts-answer-gate/knowledge-now.webp",
        width: 1600,
        height: 1250,
        alt: "A question about the AX7-165 at 29 November 2020 under current knowledge, citing the correction document",
        caption: "Valid at 29 November 2020, under current knowledge: the citations come from the correction (…-manc-b-en).",
        source: "live",
      },
      {
        src: "/shots/parts-answer-gate/knowledge-then.webp",
        width: 1600,
        height: 1250,
        alt: "The same question and validity date, known at 29 November 2020, citing the original revision",
        caption: "The same question and validity date, known at 29 November 2020: the citations come from the original revision (…-man-b-en).",
        source: "live",
      },
      {
        src: "/shots/parts-answer-gate/failure-e.webp",
        width: 1600,
        height: 1250,
        alt: "Kill condition E failing on the live deployment: a Turkish question the corpus cannot support, answered anyway",
        caption: "Kill condition E failing, live: the corpus has no passage that answers this, and the gate answers anyway. Published, not cropped out.",
        source: "live",
      },
      {
        src: "/shots/parts-answer-gate/refused.webp",
        width: 1600,
        height: 1000,
        alt: "A question the corpus cannot support, withheld by the gate",
        caption: "A question the corpus cannot support, withheld.",
        source: "live",
      },
      {
        src: "/shots/parts-answer-gate/evidence.webp",
        width: 1600,
        height: 1000,
        alt: "Top of the evidence page: hold-out retrieval figures and the start of the baseline table, under the failure banner",
        caption: "The top of the evidence page: hold-out figures and the start of the baseline table, under the failure banner.",
        source: "live",
      },
    ],
    githubUrl: "https://github.com/tair800/parts-answer-gate",
    liveUrl: "https://parts-answer-gate.onrender.com",
    demoNote: "Free demo — may take ~1 min to wake.",
  },
];

export const flagships = projects.filter((project) => project.flagship);

/** The one figure the home page shows beside a project. */
export function leadMetric(project: Project): Metric {
  const lead = project.evidence.find((metric) => metric.lead);
  if (!lead) throw new Error(`${project.slug} marks no lead metric`);
  return lead;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
