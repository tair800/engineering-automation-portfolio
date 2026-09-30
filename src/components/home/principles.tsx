import Link from "next/link";
import { getProject } from "@/data/projects";
import { principles } from "@/data/principles";
import { pad } from "@/lib/format";
import { Section, SectionHeading } from "../section-heading";

export function Principles() {
  return (
    <Section id="principles" labelledBy="principles-title">
      <SectionHeading
        id="principles-title"
        index="06"
        label="Engineering principles"
        title="How the work is decided"
      >
        Seven rules that recur across the projects, each with the places it can be checked.
      </SectionHeading>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-2">
        {principles.map((principle, i) => (
          <li key={principle.title} className="flex flex-col bg-surface p-5 sm:p-6">
            <p className="num font-mono text-[11px] text-faint">{pad(i + 1)}</p>
            <h3 className="mt-2 text-[17px] font-semibold leading-6 tracking-[-0.01em] text-ink">
              {principle.title}
            </h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">{principle.body}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[12.5px] text-muted md:mt-auto md:pt-4">
              <span className="label">Seen in</span>
              {principle.seenIn.map((slug) => {
                const project = getProject(slug);
                if (!project) return null;
                return (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    data-identity={project.identity}
                    className="link-underline hover:text-id"
                  >
                    {project.name}
                  </Link>
                );
              })}
            </p>
          </li>
        ))}
        {principles.length % 2 === 1 ? (
          <li aria-hidden="true" className="hidden bg-surface-2 md:block" />
        ) : null}
      </ol>
    </Section>
  );
}
