export interface Role {
  title: string;
  organisation: string;
  /** The employer as the hero names it. */
  employer: string;
  period: string;
  /** ISO month the role started, for machine-readable dates. */
  start: string;
  /** One sentence, in the role's public terms. */
  summary: string;
}

export const profile = {
  name: "Tahir Aslanli",
  role: "AI Automation Engineer",
  headline:
    "I build AI-enabled automation and backend systems that turn manual business processes into reliable software.",
  /** The hero's one line of keywords; the full list is under Experience. */
  worksWith: "Works with Python, APIs and databases, LLM and RAG integrations, and workflow automation.",
  /**
   * Said once, above the selected work: the public projects are independent work, and nothing on
   * the site may read as the employer's.
   */
  independence:
    "Independent projects, built on public or sample data and separate from my work at PASHA Insurance. Each is tested against a simpler alternative, and its limits are published.",
  githubUrl: "https://github.com/tair800",
  linkedinUrl: "https://www.linkedin.com/in/tahir-aslanli-075b4924b",
  experience: [
    {
      title: "AI Automation Engineer",
      organisation: "PASHA Insurance OJSC",
      employer: "PASHA Insurance",
      period: "January 2026 — present",
      start: "2026-01",
      summary: "Building AI-enabled automation and integrations for internal insurance systems.",
    },
  ] satisfies Role[],
};
