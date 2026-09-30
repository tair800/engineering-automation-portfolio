import Link from "next/link";
import { getProject } from "@/data/projects";
import { principles } from "@/data/principles";
import { Section, SectionHeading } from "../section-heading";

export function Principles() {
  return (
    <Section id="principles" labelledBy="principles-title">
      <SectionHeading
        id="principles-title"
        label="Engineering principles"
        title="How the work is decided"
      >
        Seven rules that recur across the projects, each with the places it can be checked.
      </SectionHeading>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-2">
        {principles.map((principle, i) => (
          <li
            key={principle.title}
            className={`flex flex-col bg-surface p-5 sm:p-6 ${
              i === principles.length - 1 && principles.length % 2 === 1 ? "md:col-span-2" : ""
            }`}
          >
            <h3 className="text-balance text-[17px] font-semibold leading-6 tracking-[-0.01em] text-ink">
              {principle.title}
            </h3>
            <p className="mt-2 max-w-[40rem] text-pretty text-[14px] leading-[1.6] text-ink-2">{principle.body}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 pt-1 text-[12.5px] text-muted md:mt-auto md:pt-4">
              <span className="label">Seen in</span>
              {principle.seenIn.map((slug) => {
                const project = getProject(slug);
                if (!project) return null;
                return (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    data-identity={project.identity}
                    className="link-underline inline-block py-1 hover:text-id"
                  >
                    {project.name}
                  </Link>
                );
              })}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
