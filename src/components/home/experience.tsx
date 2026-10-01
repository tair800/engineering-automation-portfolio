import { profile } from "@/data/profile";
import { coreTechnologies } from "@/data/skills";
import { Section, SectionHeading } from "../section-heading";

/** The current role in a sentence, and the technologies, as names. */
export function Experience() {
  const role = profile.experience[0];
  return (
    <Section id="experience" labelledBy="experience-title">
      <SectionHeading id="experience-title" title="Experience" />
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-[13px] font-medium text-muted">Current role</p>
          <h3 className="mt-2 text-[20px] font-semibold leading-7 tracking-[-0.015em] text-ink">{role.title}</h3>
          <p className="mt-1 text-[15px] text-ink-2">
            {role.employer} · <time dateTime={role.start}>{role.period}</time>
          </p>
          <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-ink-2">{role.summary}</p>
        </div>
        <div className="lg:col-span-7">
          <h3 className="text-[13px] font-medium text-muted">Core technologies</h3>
          {/* Space between items, tight leading within one, so a wrapped name still reads as one. */}
          <ul className="mt-2 columns-2 gap-x-8 text-[15px] leading-6 text-ink sm:columns-3">
            {coreTechnologies.map((technology) => (
              <li key={technology.name} className="break-inside-avoid py-1">
                {technology.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
