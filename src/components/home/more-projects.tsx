import Link from "next/link";
import { leadMetric, projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { pad } from "@/lib/format";
import { Metric } from "../metric";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";
import { StatusBadge } from "../status-badge";

/**
 * One line per project: what it is, the one figure that carries it, and the ways in. A negative
 * result carries its status badge directly under the name, so it cannot be read as a success.
 */
function ProjectRow({ project }: { project: Project }) {
  const titleId = `${project.slug}-row`;
  const negative = project.status.kind === "negative-result";
  return (
    <li data-identity={project.identity} className="border-b border-line">
      <article aria-labelledby={titleId} className="grid gap-4 py-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-2 lg:col-span-4">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <span aria-hidden="true" className="h-3 w-[3px] rounded-full bg-id" />
            <span className="text-ink">{pad(project.index)}</span>
            <span>{project.domain}</span>
          </p>
          <h3 id={titleId} className="text-balance text-[19px] font-semibold leading-7 tracking-[-0.015em] text-ink">
            <Link href={`/projects/${project.slug}`} prefetch={false} className="hover:text-id">
              {project.name}
            </Link>
          </h3>
          {negative ? <StatusBadge status={project.status} /> : null}
          <p className="text-pretty text-[14px] leading-[1.6] text-ink-2">{project.tagline}</p>
        </div>
        <div className="lg:col-span-5">
          <Metric metric={leadMetric(project)} />
        </div>
        <div className="lg:col-span-3">
          <ProofLinks project={project} backend={false} compact />
        </div>
      </article>
    </li>
  );
}

export function MoreProjects() {
  const others = projects.filter((project) => !project.flagship);
  return (
    <Section id="more-projects" labelledBy="more-projects-title">
      <SectionHeading id="more-projects-title" label="More projects" title="Four more public systems">
        Each is its own repository, with its own tests, CI and live deployment.
      </SectionHeading>
      <ul className="mt-6 border-t border-line">
        {others.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ul>
    </Section>
  );
}
