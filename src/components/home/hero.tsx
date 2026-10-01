import Link from "next/link";
import { profile } from "@/data/profile";
import { ArrowRight, ArrowUpRight } from "../icons";

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface px-4 text-[14px] text-ink transition-colors hover:border-ink/40";

/** Who, what, where — and the three ways in. Nothing about methods or metrics here. */
export function Hero() {
  const current = profile.experience[0];
  return (
    <section aria-labelledby="hero-title">
      <div className="container-page pb-10 pt-14 sm:pb-14 sm:pt-20 lg:pt-24">
        <h1
          id="hero-title"
          className="text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[56px] lg:text-[64px]"
        >
          {profile.name}
        </h1>
        <p className="mt-2 text-[20px] font-medium tracking-[-0.01em] text-muted sm:text-[24px]">{profile.role}</p>
        <p className="mt-6 max-w-[36rem] text-pretty text-[18px] leading-[1.55] text-ink sm:text-[20px]">
          {profile.headline}
        </p>
        <p className="mt-3 text-[16px] leading-6 text-ink-2">
          Currently at <span className="font-medium text-ink">{current.employer}</span>.
        </p>
        <p className="mt-1 max-w-[36rem] text-pretty text-[15px] leading-6 text-muted">{profile.worksWith}</p>
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
          <Link
            href="#work"
            className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-ink px-4 text-[14px] font-medium text-bg transition-opacity hover:opacity-85"
          >
            View selected work <ArrowRight className="size-4" />
          </Link>
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
            GitHub <ArrowUpRight className="size-3.5 text-muted" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
            LinkedIn <ArrowUpRight className="size-3.5 text-muted" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
