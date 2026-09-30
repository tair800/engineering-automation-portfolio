import Link from "next/link";
import { principles } from "@/data/principles";
import { profile } from "@/data/profile";
import { pad } from "@/lib/format";
import { ArrowRight, ArrowUpRight } from "../icons";

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface px-4 text-[14px] text-ink transition-colors hover:border-ink/40";

export function Hero() {
  const current = profile.experience[0];
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="grid-backdrop pointer-events-none absolute inset-0" />
      <div className="container-page relative grid gap-10 pb-10 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-12 lg:pt-16">
        <div className="lg:col-span-7">
          <p className="label">Engineering portfolio</p>
          <h1
            id="hero-title"
            className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[60px] lg:text-[68px]"
          >
            {profile.name}
          </h1>
          <p className="mt-3 text-[22px] font-medium leading-8 tracking-[-0.015em] text-muted sm:text-[26px]">
            {profile.role}
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-6 text-ink-2">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-pass" />
            <span>
              <span className="font-medium text-ink">{current.title}</span> @ {current.employer}
            </span>
            <span className="text-muted">
              <span aria-hidden="true" className="hidden sm:inline">· </span>
              since <time dateTime={current.start}>January 2026</time>
            </span>
          </p>
          <p className="mt-6 max-w-[36rem] text-pretty text-[19px] leading-[1.5] text-ink sm:text-[21px]">
            {profile.headline}
          </p>
          <p className="mt-4 max-w-[38rem] text-pretty border-l-2 border-line-strong pl-3 text-[14px] leading-[1.6] text-ink-2">
            {profile.independence}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
            <Link
              href="#projects"
              className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-ink px-4 text-[14px] font-medium text-bg transition-opacity hover:opacity-85 sm:justify-start"
            >
              View projects <ArrowRight className="size-4" />
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

        <aside aria-labelledby="principles-title" className="lg:col-span-5 lg:pt-2">
          <div className="rounded-[var(--radius)] border border-line bg-surface/85 shadow-[var(--shadow)] backdrop-blur-[2px]">
            <h2 id="principles-title" className="label border-b border-line px-4 py-2.5 text-ink-2">
              Principles
            </h2>
            <ol>
              {principles.map((principle, i) => (
                <li
                  key={principle.title}
                  className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-line px-4 py-3 last:border-0 lg:py-4"
                >
                  <span className="num font-mono text-[11px] leading-6 text-muted">{pad(i + 1)}</span>
                  <span>
                    <span className="block text-[15px] font-medium leading-6 text-ink">{principle.title}</span>
                    <span className="mt-0.5 block text-pretty text-[13px] leading-5 text-muted">
                      {principle.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
