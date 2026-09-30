import { capabilityGroups } from "@/data/capabilities";
import { Section, SectionHeading } from "../section-heading";

export function Capabilities() {
  return (
    <Section id="capabilities" labelledBy="capabilities-title" compact>
      <SectionHeading id="capabilities-title" label="Capabilities" title="Skills and tools">
        Each is demonstrated in the projects above or named in the current role&apos;s public
        description.
      </SectionHeading>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line lg:grid-cols-4">
        {capabilityGroups.map((group) => (
          <div key={group.title} className="bg-surface p-4 sm:p-5">
            <h3 className="label text-ink">{group.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {group.items.map((item) => {
                // A skill no public project shows is marked as the role's, so the two kinds of
                // evidence are never confused.
                const detail = item.detail ?? (item.projects.length === 0 ? "current role" : null);
                return (
                  <li key={item.name} className="text-pretty text-[14px] leading-5 text-ink-2">
                    {item.name}
                    {detail ? <span className="block text-[12px] leading-4 text-muted">{detail}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
