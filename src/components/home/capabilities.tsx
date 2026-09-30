import Link from "next/link";
import { capabilityGroups } from "@/data/capabilities";
import { getProject } from "@/data/projects";
import { pad } from "@/lib/format";
import { Section, SectionHeading } from "../section-heading";

function EvidenceChips({ slugs, role }: { slugs: string[]; role?: boolean }) {
  return (
    <span className="flex flex-wrap gap-1">
      {slugs.map((slug) => {
        const project = getProject(slug);
        if (!project) return null;
        return (
          <Link
            key={slug}
            href={`/projects/${slug}`}
            title={project.name}
            data-identity={project.identity}
            className="num inline-flex h-5 items-center rounded-[4px] border border-line px-1.5 font-mono text-[10.5px] text-muted transition-colors hover:border-id hover:text-id"
          >
            {pad(project.index)}
            <span className="sr-only">: {project.name}</span>
          </Link>
        );
      })}
      {role ? (
        <span className="inline-flex h-5 items-center rounded-[4px] bg-bg-sunk px-1.5 font-mono text-[10.5px] text-ink-2">
          Role
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
        index="03"
        label="Capabilities"
        title="Skills, each with its evidence"
      >
        Numbers point to the public project that demonstrates a skill; “Role” marks work named in
        the current role&apos;s public description. A skill with neither is not listed.
      </SectionHeading>
      <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {capabilityGroups.map((group) => (
          <div key={group.title} className="bg-surface p-5 sm:p-6">
            <h3 className="label text-ink">{group.title}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {group.items.map((item) => (
                <li key={item.name} className="flex flex-col gap-1.5">
                  <span className="text-[14px] leading-5 text-ink-2">{item.name}</span>
                  <EvidenceChips slugs={item.projects} role={item.role} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-col justify-end bg-surface-2 p-5 sm:p-6">
          <p className="label">Not listed</p>
          <p className="mt-3 text-[13.5px] leading-[1.6] text-muted">
            Tools a project uses only incidentally — a cache that does nothing but back a
            readiness probe, for example — are left out, so every entry above can be checked
            against a repository or the role description.
          </p>
        </div>
      </div>
    </Section>
  );
}
