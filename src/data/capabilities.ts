/**
 * Only skills with evidence: a public project that demonstrates it, or the current role's public
 * description. Anything without either is left off rather than listed as aspiration.
 */
export interface Capability {
  name: string;
  /** A qualification that must travel with the name. */
  detail?: string;
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
      { name: "LLM integration", detail: "closed, validated outputs", projects: [LEDGER], role: true },
      { name: "RAG", projects: [PARTS], role: true },
      { name: "Embeddings · pgvector", projects: [PARTS], role: true },
      { name: "MCP", projects: [AUTHZ], role: true },
      {
        name: "Evaluation",
        detail: "against predeclared baselines",
        projects: [LEDGER, CALLSITE, RESOLVER, BORDEREAUX, PARTS],
      },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "n8n", projects: [MARKET], role: true },
      { name: "Dataiku", projects: [], role: true },
      { name: "API integration", projects: [], role: true },
      { name: "Workflow orchestration", projects: [MARKET], role: true },
    ],
  },
  {
    title: "Backend / data",
    items: [
      { name: "Python · FastAPI", projects: ALL_PROJECTS },
      { name: "C# / .NET", projects: [], role: true },
      { name: "PostgreSQL", projects: [LEDGER, MARKET, AUTHZ, BORDEREAUX, PARTS], role: true },
      { name: "MS SQL", projects: [], role: true },
    ],
  },
  {
    title: "Reliability / infrastructure",
    items: [
      { name: "Docker", projects: ALL_PROJECTS.filter((slug) => slug !== CALLSITE) },
      { name: "CI/CD", detail: "CI in GitHub Actions; demos deployed to Vercel and Render", projects: ALL_PROJECTS },
      { name: "Concurrency · idempotency", projects: [LEDGER, MARKET, AUTHZ] },
      { name: "Terraform", detail: "validated in CI, not applied", projects: [BORDEREAUX] },
    ],
  },
];
