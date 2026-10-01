import Link from "next/link";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";

/**
 * One line per project: what it does, and the caveat a reader must not miss — Parts Answer Gate's
 * negative result in particular — next to the project it belongs to.
 */
function ProjectRow({ project }: { project: Project }) {
  const { plain } = project;
  return (
    <li className="grid gap-2 py-5 lg:grid-cols-12 lg:items-baseline lg:gap-8">
      <h3 className="text-[17px] font-semibold leading-6 tracking-[-0.01em] text-ink lg:col-span-3">
        <Link href={`/projects/${project.slug}`} prefetch={false} className="hover:underline hover:decoration-line-strong hover:underline-offset-4">
          {project.name}
        </Link>
      </h3>
      <div className="lg:col-span-6">
        <p className="text-pretty text-[15px] leading-[1.6] text-ink-2">{plain.does}</p>
        {/* Calm, not alarm-red: a negative result reported plainly is a finding, not an error. */}
        {plain.caveat ? <p className="mt-1 text-pretty text-[14px] leading-[1.55] text-muted">{plain.caveat}</p> : null}
      </div>
      <div className="lg:col-span-3">
        <ProofLinks project={project} backend={false} github={false} compact />
      </div>
    </li>
  );
}

export function MoreProjects() {
  return (
    <Section id="more-work" labelledBy="more-work-title">
      <SectionHeading id="more-work-title" title="More projects" />
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {projects
          .filter((project) => !project.flagship)
          .map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
      </ul>
    </Section>
  );
}
