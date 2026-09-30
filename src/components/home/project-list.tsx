import Link from "next/link";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { pad } from "@/lib/format";
import { Brief } from "../brief";
import { ArrowRight } from "../icons";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";
import { StatusBadge } from "../status-badge";

function Identity({ project }: { project: Project }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
      <span aria-hidden="true" className="h-3 w-[3px] rounded-full bg-id" />
      <span className="text-ink">{pad(project.index)}</span>
      <span>{project.domain}</span>
    </p>
  );
}

function ProjectTitle({ project, id }: { project: Project; id: string }) {
  return (
    <h3 id={id} className="text-balance text-[20px] font-semibold leading-7 tracking-[-0.015em] text-ink">
      <Link href={`/projects/${project.slug}`} className="hover:text-id">
        {project.name}
      </Link>
    </h3>
  );
}

/** A featured project is presented in full above; here it is one line and its links. */
function FeaturedRow({ project }: { project: Project }) {
  const titleId = `${project.slug}-row`;
  return (
    <article
      data-identity={project.identity}
      aria-labelledby={titleId}
      className="grid gap-4 border-t border-line py-6 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:items-center lg:gap-8"
    >
      <div className="flex flex-col gap-2 lg:col-span-3">
        <Identity project={project} />
        <ProjectTitle project={project} id={titleId} />
      </div>
      <p className="text-pretty text-[14px] leading-[1.6] text-muted lg:col-span-5">{project.tagline}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:col-span-4">
        <ProofLinks project={project} />
        <Link
          href="#featured"
          className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-ink"
        >
          Featured above <ArrowRight className="size-3.5 -rotate-90" />
        </Link>
      </div>
    </article>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const titleId = `${project.slug}-row`;
  const evidence = project.evidence.slice(0, 2);
  return (
    <article
      data-identity={project.identity}
      aria-labelledby={titleId}
      className="grid gap-6 border-t border-line py-9 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-8"
    >
      <div className="flex flex-col gap-3 lg:col-span-3">
        <Identity project={project} />
        <ProjectTitle project={project} id={titleId} />
        <p className="text-pretty text-[14px] leading-[1.6] text-muted">{project.tagline}</p>
        <StatusBadge status={project.status} />
      </div>

      <Brief project={project} className="lg:col-span-5" />

      <div className="flex flex-col gap-5 lg:col-span-4">
        <div>
          <p className="label">Evidence</p>
          <ul className="mt-2 flex flex-col gap-3">
            {evidence.map((metric) => (
              <li key={metric.value + metric.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
                <span
                  className={`num text-[17px] font-semibold leading-6 tracking-[-0.01em] ${
                    metric.tone === "fail" ? "text-fail" : "text-ink"
                  }`}
                >
                  {metric.value}
                </span>
                <span className="text-pretty text-[13px] leading-5 text-ink-2">{metric.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-2">Proof</p>
          <ProofLinks project={project} />
        </div>
      </div>
    </article>
  );
}

export function ProjectList() {
  const featured = projects.filter((p) => p.flagship);
  const others = projects.filter((p) => !p.flagship);
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading id="projects-title" label="All projects" title="Seven public projects">
        Each is its own repository, with its own tests, CI and deployment, built on synthetic or
        public data. “Complete · frozen” means the project is finished and its code and evidence are
        fixed at a final commit.
      </SectionHeading>
      <div className="mt-12">
        {others.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
      <div className="mt-4 rounded-[var(--radius)] border border-line bg-surface-2 px-4 pt-6 sm:px-6">
        <p className="label mb-4">Featured above</p>
        {featured.map((project) => (
          <FeaturedRow key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
