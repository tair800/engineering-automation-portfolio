import { profile } from "@/data/profile";
import { ArrowUpRight } from "../icons";
import { Section, SectionTitle } from "../section-heading";

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
    <Section id="contact" labelledBy="contact-title" compact>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionTitle id="contact-title" label="Contact" title="Get in touch" />
          <p className="mt-3 text-pretty text-[15px] leading-[1.65] text-muted">
            For roles, collaboration, or questions about any of the projects.
          </p>
        </div>
        <ul className="border-y border-line lg:col-span-7">
          {channels.map((channel) => (
            <li key={channel.label} className="border-b border-line last:border-0">
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-4"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[18px] font-semibold tracking-[-0.015em] text-ink">{channel.label}</span>
                  <span className="break-all font-mono text-[12.5px] text-ink-2 group-hover:text-ink">
                    {channel.display}
                  </span>
                  <span className="text-[12.5px] text-muted">{channel.detail}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
