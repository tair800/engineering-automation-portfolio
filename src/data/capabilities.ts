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

const LEDGER = "ledger-exception-control-plane";
const MARKET = "market-approach-desk";
const CALLSITE = "callsite-impact";
const AUTHZ = "agent-authz-broker";
const RESOLVER = "counterparty-resolver";
const BORDEREAUX = "bordereaux-reconciler";
const PARTS = "parts-answer-gate";

export const ALL_PROJECTS = [LEDGER, MARKET, CALLSITE, AUTHZ, RESOLVER, BORDEREAUX, PARTS];

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: "AI systems",
    items: [
      { name: "LLM integration with closed, validated outputs", projects: [LEDGER], role: true },
      { name: "RAG with extractive answers and verbatim citations", projects: [PARTS], role: true },
      { name: "Hybrid retrieval: BM25 and embeddings", projects: [PARTS] },
      { name: "Vector databases", projects: [], role: true },
      { name: "pgvector in PostgreSQL", projects: [PARTS] },
      { name: "MCP servers and agent authorisation", projects: [AUTHZ], role: true },
      {
        name: "Evaluation against predeclared baselines",
        projects: [LEDGER, CALLSITE, RESOLVER, BORDEREAUX, PARTS],
      },
      { name: "Frozen hold-out evaluation", projects: [CALLSITE, RESOLVER, BORDEREAUX, PARTS] },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "n8n workflows", projects: [MARKET], role: true },
      {
        name: "Concurrency under overlapping runs and competing workers",
        projects: [MARKET, LEDGER],
      },
      { name: "REST API integrations", projects: [], role: true },
      { name: "OpenAPI change-impact analysis", projects: [CALLSITE] },
      { name: "AI-driven data pipelines in Dataiku", projects: [], role: true },
      {
        name: "Business-process automation with human approval",
        projects: [LEDGER, RESOLVER, BORDEREAUX],
        role: true,
      },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Python · FastAPI", projects: ALL_PROJECTS },
      { name: "PostgreSQL", projects: [LEDGER, MARKET, AUTHZ, BORDEREAUX, PARTS], role: true },
      { name: "SQLAlchemy · Alembic migrations", projects: [LEDGER, MARKET, AUTHZ, BORDEREAUX, PARTS] },
      { name: "C# / .NET REST APIs", projects: [], role: true },
      { name: "MS SQL", projects: [], role: true },
      { name: "TypeScript · Next.js consoles", projects: [LEDGER, MARKET, CALLSITE, AUTHZ] },
    ],
  },
  {
    title: "Reliability",
    items: [
      { name: "Idempotency and at-most-once side effects", projects: [LEDGER, MARKET, AUTHZ] },
      {
        name: "Row claiming: FOR UPDATE SKIP LOCKED, conditional UPDATE",
        projects: [LEDGER, MARKET, AUTHZ],
      },
      { name: "Transactional outbox, bounded retry, dead-letter queue", projects: [LEDGER] },
      { name: "Exact decimal money", projects: [LEDGER, BORDEREAUX] },
      {
        name: "Planted-breach and mutation testing",
        projects: [LEDGER, AUTHZ, RESOLVER, BORDEREAUX, PARTS],
      },
      { name: "QA and automated testing", projects: ALL_PROJECTS, role: true },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      { name: "Docker", projects: ALL_PROJECTS.filter((slug) => slug !== CALLSITE) },
      { name: "GitHub Actions CI", projects: ALL_PROJECTS },
      { name: "Terraform — validated in CI, not applied", projects: [BORDEREAUX] },
      { name: "Vercel", projects: [LEDGER, MARKET, CALLSITE, AUTHZ] },
      { name: "Render", projects: [LEDGER, MARKET, AUTHZ, RESOLVER, BORDEREAUX, PARTS] },
      { name: "Neon (serverless PostgreSQL)", projects: [LEDGER, MARKET, AUTHZ, PARTS] },
      { name: "Windows and Linux", projects: [], role: true },
    ],
  },
];
