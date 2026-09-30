import Link from "next/link";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { ArrowRight, ArrowUpRight } from "../icons";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="grid-backdrop pointer-events-none absolute inset-0" />
      <div className="container-page relative grid gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="label">Portfolio · public engineering work</p>
          <h1
            id="hero-title"
            className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[60px] lg:text-[68px]"
          >
            {profile.name}
          </h1>
          <p className="mt-3 text-[22px] font-medium leading-8 tracking-[-0.015em] text-muted sm:text-[26px]">
            {profile.role}
          </p>
          <p className="mt-8 max-w-[38rem] text-[18px] leading-[1.55] text-ink-2 sm:text-[19px]">
            {profile.headline}
          </p>
          <p className="mt-4 max-w-[38rem] text-[15px] leading-[1.65] text-muted">{profile.intro}</p>
          <div className="mt-9 flex flex-wrap gap-2.5">
            <Link
              href="#featured"
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-ink px-4 text-[14px] font-medium text-bg transition-opacity hover:opacity-85"
            >
              View projects <ArrowRight className="size-4" />
            </Link>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface px-4 text-[14px] text-ink transition-colors hover:border-ink/40"
            >
              GitHub <ArrowUpRight className="size-3.5 text-muted" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface px-4 text-[14px] text-ink transition-colors hover:border-ink/40"
            >
              LinkedIn <ArrowUpRight className="size-3.5 text-muted" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        <nav aria-label="Project index" className="lg:col-span-5 lg:pt-2">
          <div className="rounded-[var(--radius)] border border-line bg-surface/85 shadow-[var(--shadow)] backdrop-blur-[2px]">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <p className="label text-ink-2">Index</p>
              <p className="font-mono text-[10.5px] text-muted">
                {projects.length} public repositories · {projects.length} deployed
              </p>
            </div>
            <ol>
              {projects.map((project) => (
                <li key={project.slug} data-identity={project.identity} className="border-b border-line last:border-0">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 px-4 py-3 transition-colors hover:bg-surface-2"
                  >
                    <span className="num font-mono text-[11px] text-faint group-hover:text-id">
                      {String(project.index).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium leading-5 text-ink">
                        {project.name}
                      </span>
                      {project.status.kind === "negative-result" ? (
                        <span className="mt-0.5 block font-mono text-[10px] uppercase leading-4 tracking-[0.06em] text-fail">
                          {project.status.label}
                        </span>
                      ) : (
                        <span className="block truncate text-[12px] leading-4 text-muted">
                          {project.domain}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-pass" />
                      Live
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>
    </section>
  );
}
