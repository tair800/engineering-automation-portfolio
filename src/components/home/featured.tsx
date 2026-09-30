import Link from "next/link";
import { flagships, leadMetric } from "@/data/projects";
import type { Project } from "@/data/types";
import { pad } from "@/lib/format";
import { Metric } from "../metric";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";

/**
 * One flagship: the problem and what was built in a line each, the single figure that carries it,
 * the skills it shows, and the three ways in. Architecture, the full evidence and the limitations
 * are the case study's job, not the card's.
 *
 * On wide screens the three cards share their row tracks (subgrid), so their results sit on one
 * line and can be read across like a single panel.
 */
function FlagshipCard({ project }: { project: Project }) {
  const brief = project.brief;
  if (!brief) return null;
  const titleId = `${project.slug}-feature`;

  return (
    <article
      data-identity={project.identity}
      aria-labelledby={titleId}
      className="relative flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-[var(--shadow)] lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-id" />
      <header className="px-5 pt-6 sm:px-6">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-id" />
          <span className="text-id">{pad(project.index)}</span>
          <span>{project.domain}</span>
        </p>
        <h3
          id={titleId}
          className="mt-3 text-balance text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink sm:text-[24px] sm:leading-8"
        >
          <Link href={`/projects/${project.slug}`} prefetch={false} className="hover:text-id">
            {project.name}
          </Link>
        </h3>
      </header>

      <dl className="flex flex-col gap-3 px-5 pt-4 sm:px-6">
        <div>
          <dt className="label">Problem</dt>
          <dd className="mt-1 text-pretty text-[14px] leading-[1.55] text-ink-2">{brief.problem}</dd>
        </div>
        <div>
          <dt className="label">Built</dt>
          <dd className="mt-1 text-pretty text-[14px] leading-[1.55] text-ink-2">{brief.built}</dd>
        </div>
      </dl>

      {/* A band in the project's own hue; across the aligned row the three read as one strip. */}
      <div className="mt-5 border-y border-id/20 bg-id/5 px-5 py-4 sm:px-6">
        <p className="label mb-1.5 text-id">Result</p>
        <Metric metric={leadMetric(project)} size="xl" />
      </div>

      <div className="px-5 pt-4 sm:px-6">
        <div className="overflow-hidden">
          <ul className="dot-list font-mono text-[11px] leading-5 text-muted" aria-label={`${project.name} skills`}>
            {brief.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 sm:px-6">
        <ProofLinks project={project} backend={false} compact />
      </div>
    </article>
  );
}

export function Featured() {
  return (
    <Section id="projects" labelledBy="featured-title">
      <SectionHeading id="featured-title" label="Featured engineering" title="Where a wrong action costs money">
        Each states in advance the test that would prove it wrong, and publishes the result.
        Architecture, full evidence and limitations are in each case study.
      </SectionHeading>
      <div className="mt-8 flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:grid-rows-[repeat(5,auto)] lg:gap-x-5 lg:gap-y-0">
        {flagships.map((project) => (
          <FlagshipCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
