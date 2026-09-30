export interface Role {
  title: string;
  organisation: string;
  /** The employer as the hero names it, in one line. */
  employer: string;
  period: string;
  /** ISO month the role started, for machine-readable dates. */
  start: string;
  summary: string;
  /** At most three. */
  areas: string[];
  note: string;
}

export const profile = {
  name: "Tahir Aslanli",
  role: "AI Automation Engineer",
  headline: "Building AI-enabled automation, retrieval systems and reliable backend workflows.",
  /**
   * Keeps the professional role and the public projects apart: the projects are independent
   * work, and nothing on the site may read as the employer's.
   */
  independence:
    "At PASHA Insurance I work on production automation and AI integration for internal systems. The seven projects below are independent public work, built on synthetic or public data and separate from that role.",
  githubUrl: "https://github.com/tair800",
  linkedinUrl: "https://www.linkedin.com/in/tahir-aslanli-075b4924b",
  experience: [
    {
      title: "AI Automation Engineer",
      organisation: "PASHA Insurance OJSC",
      employer: "PASHA Insurance",
      period: "Jan 2026 — Present",
      start: "2026-01",
      summary:
        "Building end-to-end automation and AI integration layers on top of internal insurance systems, in production on Windows and Linux.",
      areas: [
        "Automation workflows and REST API integrations with n8n, and AI-driven data pipelines in Dataiku",
        "AI and LLM services: RAG, vector databases and MCP",
        "C# / .NET REST APIs, MS SQL and PostgreSQL, with QA and automated testing",
      ],
      note: "Internal systems, data and architecture are confidential and are not described on this site.",
    },
  ] satisfies Role[],
};
