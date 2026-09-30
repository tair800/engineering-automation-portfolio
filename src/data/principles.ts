export interface Principle {
  title: string;
  body: string;
  /** Slugs of the projects where the principle is visible in code or in a published result. */
  seenIn: string[];
}

export const principles: Principle[] = [
  {
    title: "Deterministic systems own financial truth",
    body: "Amounts, accounts and matches are computed by tested code. Where a model takes part it chooses from a closed set, and its output has no field that can carry money.",
    seenIn: ["ledger-exception-control-plane", "bordereaux-reconciler"],
  },
  {
    title: "AI proposes; deterministic rules authorise",
    body: "A model may suggest a treatment, a column mapping or a reply category, and an agent may request an action. Whether anything happens is decided by rules, policy and people.",
    seenIn: [
      "ledger-exception-control-plane",
      "market-approach-desk",
      "agent-authz-broker",
      "bordereaux-reconciler",
    ],
  },
  {
    title: "Measure against real baselines",
    body: "Every headline number sits beside the simplest thing that could have worked — a constant answer, a naive branch, header matching, a single identifier rule. Sometimes the baseline wins, and that is published too.",
    seenIn: [
      "ledger-exception-control-plane",
      "callsite-impact",
      "counterparty-resolver",
      "bordereaux-reconciler",
      "parts-answer-gate",
    ],
  },
  {
    title: "Publish negative results",
    body: "A release gate that failed is reported as failed. A hold-out is scored once, and a spent hold-out is not reused to fix what it revealed.",
    seenIn: ["parts-answer-gate", "callsite-impact", "ledger-exception-control-plane"],
  },
  {
    title: "Fail closed at security boundaries",
    body: "A token for the wrong audience, a scope the delegator never had, a missing or spent approval, an answer the evidence cannot support: each is refused, and the refusal is recorded.",
    seenIn: ["agent-authz-broker", "parts-answer-gate", "ledger-exception-control-plane"],
  },
  {
    title: "Design retry and idempotency explicitly",
    body: "Every side effect has an identity, a claim only one worker can win, and a defined answer for the case where nobody knows whether it happened.",
    seenIn: ["ledger-exception-control-plane", "market-approach-desk", "agent-authz-broker"],
  },
  {
    title: "Distinguish model quality from system correctness",
    body: "How often a model or retriever is right is one measurement. Whether a wrong output can reach the ledger or the technician is another, and the two are reported separately.",
    seenIn: ["ledger-exception-control-plane", "parts-answer-gate"],
  },
];
