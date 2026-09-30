import Link from "next/link";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { pad } from "@/lib/format";
import { Brief } from "../brief";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";
import { StatusBadge } from "../status-badge";

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
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          <span aria-hidden="true" className="h-3 w-[3px] rounded-full bg-id" />
          <span className="text-ink">{pad(project.index)}</span>
          <span>{project.domain}</span>
        </p>
        <h3
          id={titleId}
          className="text-[20px] font-semibold leading-7 tracking-[-0.015em] text-ink"
        >
          <Link href={`/projects/${project.slug}`} className="hover:text-id">
            {project.name}
          </Link>
        </h3>
        <p className="text-[14px] leading-[1.6] text-muted">{project.tagline}</p>
        <StatusBadge status={project.status} />
      </div>

      <Brief project={project} className="lg:col-span-5" />

      <div className="flex flex-col gap-5 lg:col-span-4">
        <div>
          <p className="label">Evidence</p>
          <ul className="mt-2 flex flex-col gap-3">
            {evidence.map((metric) => (
              <li key={metric.value + metric.label} className="flex items-baseline gap-3">
                <span
                  className={`num shrink-0 text-[17px] font-semibold leading-6 tracking-[-0.01em] ${
                    metric.tone === "fail"
                      ? "text-fail"
                      : metric.tone === "pass"
                        ? "text-pass"
                        : "text-ink"
                  }`}
                >
                  {metric.value}
                </span>
                <span className="text-[13px] leading-5 text-ink-2">{metric.label}</span>
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
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading id="projects-title" index="04" label="All projects" title="Seven public projects">
        Each is its own repository, with its own tests, CI and deployment, built on synthetic or
        public data. Every one is live; the free-tier backends can take up to a minute to wake.
      </SectionHeading>
      <div className="mt-12">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
