import Link from "next/link";
import { ALL_PROJECTS, capabilityGroups } from "@/data/capabilities";
import { getProject } from "@/data/projects";
import { Section, SectionHeading } from "../section-heading";

const chip =
  "inline-flex h-6 items-center rounded-[4px] border border-line px-1.5 text-[12px] text-muted transition-colors hover:border-id hover:text-id";

function EvidenceChips({ slugs, role }: { slugs: string[]; role?: boolean }) {
  const everyProject = slugs.length === ALL_PROJECTS.length;
  return (
    <span className="flex flex-wrap gap-1">
      {everyProject ? (
        <Link href="/#projects" className={chip}>
          All seven projects
        </Link>
      ) : (
        slugs
          .map((slug) => getProject(slug))
          .filter((project) => project !== undefined)
          .sort((a, b) => a.index - b.index)
          .map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              title={project.name}
              data-identity={project.identity}
              className={chip}
            >
              {project.short}
            </Link>
          ))
      )}
      {role ? (
        <span className="inline-flex h-6 items-center rounded-[4px] bg-bg-sunk px-1.5 text-[12px] text-ink-2">
          Current role
        </span>
      ) : null}
    </span>
  );
}

export function Capabilities() {
  return (
    <Section id="capabilities" labelledBy="capabilities-title">
      <SectionHeading
        id="capabilities-title"
        label="Capabilities"
        title="Skills, each with its evidence"
      >
        Each skill links to the public projects that demonstrate it; “Current
        role” marks work named in the role&apos;s public description. A skill
        with neither is not listed.
      </SectionHeading>
      <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {capabilityGroups.map((group, i) => {
          // The last group fills the rest of the final row instead of leaving an empty cell.
          const last = i === capabilityGroups.length - 1;
          return (
            <div
              key={group.title}
              className={`bg-surface p-5 sm:p-6 ${last ? "md:col-span-2 lg:col-span-2" : ""}`}
            >
              <h3 className="label text-ink">{group.title}</h3>
              <ul
                className={`mt-4 grid gap-3 ${last ? "lg:grid-cols-2 lg:gap-x-8" : ""}`}
              >
                {group.items.map((item) => (
                  <li key={item.name} className="flex flex-col gap-1.5">
                    <span className="text-pretty text-[14px] leading-5 text-ink-2">
                      {item.name}
                    </span>
                    <EvidenceChips slugs={item.projects} role={item.role} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-4 max-w-[46rem] text-pretty text-[13px] leading-[1.6] text-muted">
        Not listed: tools a project uses only incidentally — a cache that does
        nothing but back a readiness probe, for example — so every entry above
        can be checked against a repository or the role description.
      </p>
    </Section>
  );
}
