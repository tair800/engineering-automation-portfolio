import Link from "next/link";
import { getProject, projects } from "@/data/projects";
import { pad } from "@/lib/format";
import { ArrowRight } from "../icons";
import { ToneTag } from "../metric";
import { Section, SectionHeading } from "../section-heading";
import { KillGrid } from "../visuals/kill-grid";

export function Results() {
  const groups = projects
    .map((project) => ({ project, metrics: project.evidence.filter((m) => m.headline) }))
    .filter((group) => group.metrics.length > 0);
  const parts = getProject("parts-answer-gate");

  return (
    <Section id="results" labelledBy="results-title">
      <SectionHeading id="results-title" label="Measured results" title="What the tests found">
        Every figure comes from the project&apos;s own committed evidence, and each links to its
        case study. Figures in red are negative results, listed with the rest.
      </SectionHeading>

      <div className="mt-12 border-y border-line">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[15rem_10.5rem_1fr] gap-x-6 border-b border-line py-2.5 md:grid"
        >
          <span className="label">Project</span>
          <span className="label">Result</span>
          <span className="label">What was measured</span>
        </div>
        <ol>
          {groups.map(({ project, metrics }) => (
            <li
              key={project.slug}
              data-identity={project.identity}
              className="grid gap-x-6 gap-y-3 border-b border-line py-5 last:border-0 md:grid-cols-[15rem_1fr]"
            >
              <Link
                href={`/projects/${project.slug}`} prefetch={false}
                className="group flex items-baseline gap-2 self-start text-[13.5px] font-medium text-ink md:pt-1"
              >
                <span className="num font-mono text-[11px] text-muted group-hover:text-id">
                  {pad(project.index)}
                </span>
                <span className="group-hover:text-id">{project.name}</span>
              </Link>
              <ul className="flex flex-col gap-4">
                {metrics.map((metric) => (
                  <li
                    key={metric.value + metric.label}
                    className="grid gap-x-6 gap-y-1 md:grid-cols-[10.5rem_1fr] md:items-baseline"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span
                        className={`num text-[22px] font-semibold leading-7 tracking-[-0.02em] ${
                          metric.tone === "fail" ? "text-fail" : "text-ink"
                        }`}
                      >
                        {metric.value}
                      </span>
                      <ToneTag tone={metric.tone} />
                    </span>
                    <span className="text-pretty text-[14px] leading-[1.55] text-ink-2">
                      {metric.label}
                      {metric.note ? (
                        <span className="mt-1 block text-[12.5px] leading-5 text-muted">{metric.note}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {parts ? (
        <div
          data-identity={parts.identity}
          className="mt-12 grid gap-8 rounded-[var(--radius)] border border-line bg-surface p-4 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8"
        >
          <div className="flex flex-col lg:col-span-4">
            <p className="label text-fail">A published negative result</p>
            <h3 className="mt-3 text-balance text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink">
              {parts.name}
            </h3>
            <p className="mt-3 text-pretty text-[14px] leading-[1.65] text-ink-2">{parts.summary}</p>
            <p className="mt-3 text-pretty text-[14px] leading-[1.65] text-muted">
              It never returned a superseded or wrong-variant passage in 600 replayed queries, and
              all 3,669 citations were faithful to their documents. It failed on refusing
              unanswerable questions, on beating simpler retrieval baselines and on running vector
              search through the pgvector index — and it is closed on that result.
            </p>
            <Link
              href={`/projects/${parts.slug}`} prefetch={false}
              className="mt-6 inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-ink hover:text-id"
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
