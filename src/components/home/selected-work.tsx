import Link from "next/link";
import { profile } from "@/data/profile";
import { flagships } from "@/data/projects";
import type { Project } from "@/data/types";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";

/**
 * One selected project, in plain English: what it does, what was built, one result anyone can
 * read, a few technologies and the ways in. The technical account is the case study's job.
 */
function ProjectCard({ project }: { project: Project }) {
  const { plain } = project;
  const titleId = `${project.slug}-work`;
  return (
    <article aria-labelledby={titleId} className="flex flex-col border-t border-line-strong pt-5">
      {/* What kind of system it is, in two plain words, before its name. */}
      <p className="text-[13px] font-medium text-muted">{project.domain}</p>
      <h3 id={titleId} className="mt-1.5 text-balance text-[21px] font-semibold leading-7 tracking-[-0.015em] text-ink">
        <Link href={`/projects/${project.slug}`} prefetch={false} className="hover:underline hover:decoration-line-strong hover:underline-offset-4">
          {project.name}
        </Link>
      </h3>
      <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-ink">{plain.does}</p>
      <p className="mt-2 text-pretty text-[15px] leading-[1.6] text-ink-2">{plain.built}</p>
      {plain.figure ? (
        // Read as one sentence: "0 of 5 attack scenarios got through…".
        <p className="mt-5 text-pretty text-[15px] leading-[1.6] text-ink-2">
          <span className="num mr-1.5 text-[22px] font-semibold tracking-[-0.02em] text-ink">{plain.figure.value}</span>
          {plain.figure.label}
        </p>
      ) : null}
      <p className="mt-4 text-[13px] leading-5 text-muted">
        <span className="sr-only">Technologies: </span>
        {plain.tech.join(" · ")}
      </p>
      <div className="mt-3">
        <ProofLinks project={project} backend={false} compact />
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <Section id="work" labelledBy="work-title">
      <SectionHeading id="work-title" title="Selected work">
        {profile.independence}
      </SectionHeading>
      <div className="mt-8 grid gap-12 lg:grid-cols-3 lg:gap-10">
        {flagships.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
