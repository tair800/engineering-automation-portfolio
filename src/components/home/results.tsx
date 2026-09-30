import Link from "next/link";
import { getProject, projects } from "@/data/projects";
import { pad } from "@/lib/format";
import { ArrowRight } from "../icons";
import { ToneTag } from "../metric";
import { Section, SectionHeading } from "../section-heading";
import { KillGrid } from "../visuals/kill-grid";

export function Results() {
  const rows = projects.flatMap((project) =>
    project.evidence.filter((metric) => metric.headline).map((metric) => ({ project, metric })),
  );
  const parts = getProject("parts-answer-gate");

  return (
    <Section id="results" labelledBy="results-title">
      <SectionHeading id="results-title" index="02" label="Measured results" title="What the tests found">
        Every figure comes from the project&apos;s own committed evidence and links to it. The
        negative results are listed with the rest, because they are part of the result.
      </SectionHeading>

      <div className="mt-12 border-y border-line">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[15rem_9rem_1fr_6rem] gap-x-6 border-b border-line py-2.5 md:grid"
        >
          <span className="label">Project</span>
          <span className="label">Result</span>
          <span className="label">What was measured</span>
          <span className="label text-right">Reading</span>
        </div>
        <ol>
          {rows.map(({ project, metric }) => (
            <li
              key={project.slug + metric.value}
              data-identity={project.identity}
              className="grid gap-x-6 gap-y-1 border-b border-line py-4 last:border-0 md:grid-cols-[15rem_10.5rem_1fr_6rem] md:items-baseline"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group flex items-baseline gap-2 text-[13.5px] font-medium text-ink"
              >
                <span className="num font-mono text-[11px] text-faint group-hover:text-id">
                  {pad(project.index)}
                </span>
                <span className="group-hover:text-id">{project.name}</span>
              </Link>
              <span
                className={`num text-[22px] font-semibold leading-7 tracking-[-0.02em] ${
                  metric.tone === "fail"
                    ? "text-fail"
                    : metric.tone === "pass"
                      ? "text-pass"
                      : "text-ink"
                }`}
              >
                {metric.value}
              </span>
              <span className="text-[14px] leading-[1.55] text-ink-2">
                {metric.label}
                {metric.note ? (
                  <span className="mt-1 block text-[12.5px] leading-5 text-muted">{metric.note}</span>
                ) : null}
              </span>
              <span className="md:text-right">
                <ToneTag tone={metric.tone} />
              </span>
            </li>
          ))}
        </ol>
      </div>

      {parts ? (
        <div
          data-identity={parts.identity}
          className="mt-12 grid gap-8 rounded-[var(--radius)] border border-line bg-surface p-5 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8"
        >
          <div className="flex flex-col lg:col-span-4">
            <p className="label text-fail">A published negative result</p>
            <h3 className="mt-3 text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink">
              {parts.name}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-ink-2">{parts.summary}</p>
            <p className="mt-3 text-[14px] leading-[1.65] text-muted">
              Effectivity filtering held on every replayed query and no citation was unfaithful.
              The retrieval, abstention and vector-index criteria did not hold, and the project is
              closed on that result.
            </p>
            <Link
              href={`/projects/${parts.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-ink hover:text-id lg:mt-auto lg:pt-6"
            >
              Read the case study <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="min-w-0 lg:col-span-8">
            {parts.visual.type === "killgrid" ? <KillGrid visual={parts.visual} /> : null}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
