import { profile } from "@/data/profile";
import { ArrowUpRight } from "../icons";
import { Section, SectionHeading } from "../section-heading";

const channels = [
  {
    label: "LinkedIn",
    detail: "The best place to reach me",
    href: profile.linkedinUrl,
    display: "linkedin.com/in/tahir-aslanli-075b4924b",
  },
  {
    label: "GitHub",
    detail: "Every project on this site, with its history",
    href: profile.githubUrl,
    display: "github.com/tair800",
  },
];

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionHeading id="contact-title" index="07" label="Contact" title="Get in touch">
        For roles, collaboration, or questions about any of the projects.
      </SectionHeading>
      <ul className="mt-12 border-y border-line">
        {channels.map((channel) => (
          <li key={channel.label} className="border-b border-line last:border-0">
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-1 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-6"
            >
              <span className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
                {channel.label}
              </span>
              <span className="flex flex-col">
                <span className="font-mono text-[13px] text-ink-2 group-hover:text-ink">
                  {channel.display}
                </span>
                <span className="text-[13px] text-muted">{channel.detail}</span>
              </span>
              <ArrowUpRight className="hidden size-5 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink sm:block" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
