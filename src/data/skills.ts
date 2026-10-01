/**
 * The core technologies the home page lists, as plain names. Each still records its evidence — the
 * public projects that use it, or the current role's public description — so a test can refuse
 * one that has neither, even though the page shows only the names.
 */
export interface Technology {
  name: string;
  /** Slugs of the projects that use it. */
  projects: string[];
  /** Also part of the current role, as publicly described. */
  role?: boolean;
}

const LEDGER = "ledger-exception-control-plane";
const MARKET = "market-approach-desk";
const CALLSITE = "callsite-impact";
const AUTHZ = "agent-authz-broker";
const RESOLVER = "counterparty-resolver";
const BORDEREAUX = "bordereaux-reconciler";
const PARTS = "parts-answer-gate";

const ALL = [LEDGER, MARKET, CALLSITE, AUTHZ, RESOLVER, BORDEREAUX, PARTS];

export const coreTechnologies: Technology[] = [
  { name: "Python", projects: ALL },
  { name: "FastAPI", projects: ALL },
  { name: "C# / .NET", projects: [], role: true },
  { name: "PostgreSQL / MS SQL", projects: [LEDGER, MARKET, AUTHZ, BORDEREAUX, PARTS], role: true },
  { name: "REST APIs", projects: ALL, role: true },
  { name: "n8n", projects: [MARKET], role: true },
  { name: "RAG / vector databases", projects: [PARTS], role: true },
  { name: "LLM integrations", projects: [LEDGER], role: true },
  { name: "MCP", projects: [AUTHZ], role: true },
  { name: "Docker", projects: ALL.filter((slug) => slug !== CALLSITE) },
  { name: "GitHub Actions", projects: ALL },
  { name: "Dataiku", projects: [], role: true },
];
