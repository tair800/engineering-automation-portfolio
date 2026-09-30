/**
 * Only skills with evidence: a public project that demonstrates it, or the current role's public
 * description. Anything without either is left off rather than listed as aspiration.
 */
export interface Capability {
  name: string;
  /** Slugs of the projects that demonstrate it. */
  projects: string[];
  /** Also part of the current role, as publicly described. */
  role?: boolean;
}

export interface CapabilityGroup {
  title: string;
  items: Capability[];
}

const ALL = [
  "ledger-exception-control-plane",
  "market-approach-desk",
  "callsite-impact",
  "agent-authz-broker",
  "counterparty-resolver",
  "bordereaux-reconciler",
  "parts-answer-gate",
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: "AI systems",
    items: [
      {
        name: "LLM integration with closed, validated outputs",
        projects: ["ledger-exception-control-plane"],
        role: true,
      },
      {
        name: "Retrieval-augmented answers with verbatim citations",
        projects: ["parts-answer-gate"],
        role: true,
      },
      { name: "Hybrid retrieval: BM25 and embeddings", projects: ["parts-answer-gate"] },
      { name: "Vector databases: pgvector (HNSW)", projects: ["parts-answer-gate"], role: true },
      { name: "MCP servers and agent authorisation", projects: ["agent-authz-broker"], role: true },
      {
        name: "Evaluation against predeclared baselines and hold-out sets",
        projects: [
          "ledger-exception-control-plane",
          "callsite-impact",
          "counterparty-resolver",
          "bordereaux-reconciler",
          "parts-answer-gate",
        ],
      },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "n8n workflows", projects: ["market-approach-desk"], role: true },
      {
        name: "Scheduled and concurrent workflow execution",
        projects: ["market-approach-desk", "ledger-exception-control-plane"],
      },
      { name: "REST API integrations", projects: [], role: true },
      { name: "OpenAPI change-impact analysis", projects: ["callsite-impact"] },
      { name: "AI-driven data pipelines in Dataiku", projects: [], role: true },
      {
        name: "Business-process automation with human approval",
        projects: [
          "ledger-exception-control-plane",
          "counterparty-resolver",
          "bordereaux-reconciler",
        ],
        role: true,
      },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Python · FastAPI", projects: ALL },
      {
        name: "PostgreSQL · SQLAlchemy · Alembic",
        projects: [
          "ledger-exception-control-plane",
          "market-approach-desk",
          "agent-authz-broker",
          "bordereaux-reconciler",
          "parts-answer-gate",
        ],
        role: true,
      },
      { name: "C# / .NET REST APIs", projects: [], role: true },
      { name: "MS SQL", projects: [], role: true },
      {
        name: "TypeScript · Next.js operator consoles",
        projects: [
          "ledger-exception-control-plane",
          "market-approach-desk",
          "callsite-impact",
          "agent-authz-broker",
        ],
      },
    ],
  },
  {
    title: "Reliability",
    items: [
      {
        name: "Idempotency and at-most-once side effects",
        projects: ["ledger-exception-control-plane", "market-approach-desk", "agent-authz-broker"],
      },
      {
        name: "Row claiming: FOR UPDATE SKIP LOCKED, conditional UPDATE",
        projects: ["ledger-exception-control-plane", "market-approach-desk", "agent-authz-broker"],
      },
      {
        name: "Transactional outbox, bounded retry, dead-letter queue",
        projects: ["ledger-exception-control-plane"],
      },
      {
        name: "Exact decimal money",
        projects: ["ledger-exception-control-plane", "bordereaux-reconciler"],
      },
      {
        name: "Planted-breach and mutation testing",
        projects: [
          "ledger-exception-control-plane",
          "agent-authz-broker",
          "counterparty-resolver",
          "bordereaux-reconciler",
          "parts-answer-gate",
        ],
      },
      { name: "QA and automated testing", projects: ALL, role: true },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      {
        name: "Docker",
        projects: ALL.filter((slug) => slug !== "callsite-impact"),
      },
      { name: "GitHub Actions CI", projects: ALL },
      { name: "Terraform — validated in CI, not applied", projects: ["bordereaux-reconciler"] },
      { name: "Vercel · Render · Neon", projects: ALL },
      { name: "Windows and Linux", projects: [], role: true },
    ],
  },
];
