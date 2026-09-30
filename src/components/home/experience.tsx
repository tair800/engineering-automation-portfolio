import { profile } from "@/data/profile";
import { Section, SectionHeading } from "../section-heading";

export function Experience() {
  return (
    <Section id="experience" labelledBy="experience-title">
      <SectionHeading
        id="experience-title"
        index="05"
        label="Professional experience"
        title="Current role"
      />
      <ol className="mt-12">
        {profile.experience.map((role) => (
          <li
            key={role.organisation + role.start}
            className="grid gap-6 rounded-[var(--radius)] border border-line bg-surface p-5 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8"
          >
            <div className="lg:col-span-4">
              <p className="label">
                <time dateTime={role.start}>{role.period}</time>
              </p>
              <h3 className="mt-3 text-[20px] font-semibold leading-7 tracking-[-0.015em] text-ink">
                {role.title}
              </h3>
              <p className="mt-1 text-[15px] text-ink-2">{role.organisation}</p>
            </div>
            <div className="lg:col-span-8">
              <p className="text-[16px] leading-[1.6] text-ink">{role.summary}</p>
              <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {role.areas.map((area) => (
                  <li key={area} className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-2">
                    <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-line-strong" />
                    {area}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-[13px] leading-5 text-muted">
                {role.note}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
