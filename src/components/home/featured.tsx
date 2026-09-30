import Link from "next/link";
import { flagships } from "@/data/projects";
import type { Project } from "@/data/types";
import { pad } from "@/lib/format";
import { Metric } from "../metric";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";
import { StatusBadge } from "../status-badge";
import { EvidenceVisual } from "../visuals/evidence-visual";

function FlagshipPanel({ project }: { project: Project }) {
  const titleId = `${project.slug}-feature`;
  return (
    <article
      data-identity={project.identity}
      aria-labelledby={titleId}
      className="overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-[var(--shadow)]"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-6">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-id" />
          <span className="text-ink">{pad(project.index)}</span>
          <span>{project.domain}</span>
        </p>
        <StatusBadge status={project.status} />
      </header>

      <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8">
        <div className="flex flex-col lg:col-span-5">
          <h3
            id={titleId}
            className="text-[24px] font-semibold leading-8 tracking-[-0.02em] text-ink sm:text-[26px]"
          >
            <Link href={`/projects/${project.slug}`} className="hover:text-id">
              {project.name}
            </Link>
          </h3>
          <p className="mt-2 text-[15px] leading-[1.6] text-muted">{project.tagline}</p>
          <p className="mt-5 text-[15px] leading-[1.65] text-ink-2">{project.summary}</p>
          <div className="mt-7 lg:mt-auto lg:pt-7">
            <ProofLinks project={project} />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <EvidenceVisual visual={project.visual} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
        {project.evidence.map((metric) => (
          <div key={metric.value + metric.label} className="bg-surface p-4 sm:p-6">
            <Metric metric={metric} />
          </div>
        ))}
      </div>
    </article>
  );
}

export function Featured() {
  return (
    <Section id="featured" labelledBy="featured-title">
      <SectionHeading
        id="featured-title"
        index="01"
        label="Featured engineering"
        title="Where a wrong action costs money"
      >
        Finance operations, agent authorisation and insurance reconciliation. Each system is shown
        beside the experiment that could have proven it wrong, and the numbers include what did
        not work.
      </SectionHeading>
      <div className="mt-12 flex flex-col gap-8">
        {flagships.map((project) => (
          <FlagshipPanel key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
