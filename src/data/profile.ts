export interface Role {
  title: string;
  organisation: string;
  period: string;
  /** ISO month the role started, for machine-readable dates. */
  start: string;
  summary: string;
  areas: string[];
  note: string;
}

export const profile = {
  name: "Tahir Aslanli",
  role: "AI Automation Engineer",
  headline:
    "Building production AI automation, agentic systems, retrieval systems and reliable backend infrastructure.",
  intro:
    "I build automation for work where a mistake is expensive: a payment posted twice, an agent acting beyond its authority, an answer quoting a superseded procedure. Each public project below states in advance the test that would prove it wrong, and publishes the result — including one whose own release gate failed.",
  githubUrl: "https://github.com/tair800",
  linkedinUrl: "https://www.linkedin.com/in/tahir-aslanli-075b4924b",
  experience: [
    {
      title: "AI Automation Engineer",
      organisation: "PASHA Insurance OJSC",
      period: "Jan 2026 — Present",
      start: "2026-01",
      summary:
        "Building end-to-end automation and AI integration layers on top of internal insurance systems.",
      areas: [
        "End-to-end automation workflows · n8n · REST API integrations",
        "AI and LLM services · RAG · vector databases · MCP",
        "AI-driven data pipelines in Dataiku",
        "C# / .NET REST APIs · MS SQL · PostgreSQL",
        "Production automation on Windows and Linux",
        "QA and automated testing · business-process automation",
      ],
      note: "Internal systems, data and architecture are confidential and are not described on this site. The public projects are independent work.",
    },
  ] satisfies Role[],
};
