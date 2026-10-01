import { profile } from "@/data/profile";
import { ArrowUpRight } from "../icons";
import { Section, SectionHeading } from "../section-heading";

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionHeading id="contact-title" title="Contact">
        LinkedIn is the best place to reach me. Every project, with its history, is on GitHub.
      </SectionHeading>
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[16px]">
        <a
          href={profile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-1 font-medium text-ink"
        >
          LinkedIn <ArrowUpRight className="size-3.5 text-faint" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-1 font-medium text-ink"
        >
          GitHub <ArrowUpRight className="size-3.5 text-faint" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </Section>
  );
}
