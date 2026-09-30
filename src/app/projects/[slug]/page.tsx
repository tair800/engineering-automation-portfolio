import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FlowDiagram } from "@/components/flow-diagram";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { Metric } from "@/components/metric";
import { ProofLinks } from "@/components/proof-links";
import { ShotFigure } from "@/components/shot-figure";
import { StatusBadge } from "@/components/status-badge";
import { EvidenceVisual } from "@/components/visuals/evidence-visual";
import { profile } from "@/data/profile";
import { getProject, projects } from "@/data/projects";
import { pad } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name} — ${profile.name}`;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title,
      description: project.summary,
    },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

function Block({
  id,
  index,
  label,
  children,
}: {
  id: string;
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-5 border-t border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-8"
    >
      <div className="lg:col-span-3">
        <h2 id={id} className="label lg:sticky lg:top-20">
          <span className="text-faint">{index}</span>
          <span className="mx-2 text-faint">/</span>
          <span className="text-ink-2">{label}</span>
        </h2>
      </div>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </section>
  );
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const position = projects.indexOf(project);
  const previous = projects[position - 1];
  const next = projects[position + 1];

  const overview: [string, string][] = [
    ["Problem", project.problem],
    ["Built", project.built],
    ["Hard part", project.hardPart],
  ];

  return (
    <article data-identity={project.identity}>
      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-backdrop pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-id" />
        <div className="container-page relative pb-12 pt-8 sm:pb-14 sm:pt-10">
          <nav aria-label="Breadcrumb">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink"
            >
              <ArrowLeft className="size-3.5" /> All projects
            </Link>
          </nav>
          <p className="mt-10 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <span aria-hidden="true" className="size-2 rounded-[2px] bg-id" />
            <span className="text-ink">{pad(project.index)}</span>
            <span>{project.domain}</span>
          </p>
          <h1 className="mt-4 max-w-[52rem] text-[36px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[48px]">
            {project.name}
          </h1>
          <p className="mt-4 max-w-[46rem] text-[17px] leading-[1.6] text-ink-2 sm:text-[18px]">
            {project.tagline}
          </p>
          <div className="mt-6">
            <StatusBadge status={project.status} />
          </div>
          <div className="mt-8">
            <ProofLinks project={project} caseStudy={false} />
          </div>
        </div>
      </header>

      <div className="container-page pb-8">
        <Block id="overview" index="01" label="Overview">
          <p className="max-w-[46rem] text-[17px] leading-[1.65] text-ink">{project.summary}</p>
          <dl className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {overview.map(([term, text]) => (
              <div key={term} className="border-t border-line pt-4">
                <dt className="label">{term}</dt>
                <dd className="mt-2 text-[14.5px] leading-[1.65] text-ink-2">{text}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block id="evidence" index="02" label="Evidence">
          <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2">
            {project.evidence.map((metric) => (
              <div key={metric.value + metric.label} className="bg-surface p-5 sm:p-6">
                <Metric metric={metric} size="lg" />
              </div>
            ))}
            {project.evidence.length % 2 === 1 ? (
              <div aria-hidden="true" className="hidden bg-surface-2 sm:block" />
            ) : null}
          </div>
          <div className="mt-6">
            <EvidenceVisual visual={project.visual} />
          </div>
        </Block>

        <Block id="architecture" index="03" label="Architecture">
          <FlowDiagram flow={project.flow} />
        </Block>

        <Block id="notes" index="04" label="Engineering notes">
          <div className="flex max-w-[46rem] flex-col gap-10">
            {project.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-[19px] font-semibold leading-7 tracking-[-0.015em] text-ink">
                  {section.heading}
                </h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="mt-3 text-[15.5px] leading-[1.7] text-ink-2">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-[15px] leading-[1.6] text-ink-2">
                        <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-id" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Block>

        <Block id="screens" index="05" label="Screens">
          <div className="grid gap-10">
            {project.shots.map((shot) => (
              <ShotFigure key={shot.src} shot={shot} sizes="(min-width: 1200px) 840px, (min-width: 1024px) 70vw, 100vw" />
            ))}
          </div>
        </Block>

        <Block id="limitations" index="06" label="Limitations">
          <p className="max-w-[46rem] text-[14.5px] leading-[1.6] text-muted">
            As the project states them. Read these before relying on any number above.
          </p>
          <ul className="mt-5 flex max-w-[46rem] flex-col border-t border-line">
            {project.limitations.map((limitation) => (
              <li
                key={limitation}
                className="flex gap-3 border-b border-line py-3.5 text-[14.5px] leading-[1.6] text-ink-2"
              >
                <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-fail" />
                {limitation}
              </li>
            ))}
          </ul>
        </Block>

        <Block id="facts" index="07" label="Facts and stack">
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2">
            {project.facts.map((fact) => (
              <div key={fact.label} className="bg-surface px-5 py-4">
                <dt className="label">{fact.label}</dt>
                <dd className="mt-1.5 text-[14px] leading-[1.55] text-ink">{fact.value}</dd>
              </div>
            ))}
            {project.facts.length % 2 === 1 ? (
              <div aria-hidden="true" className="hidden bg-surface-2 sm:block" />
            ) : null}
          </dl>
          <h3 className="label mt-8">Stack</h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded-[var(--radius-sm)] border border-line bg-surface px-2 py-1 font-mono text-[11.5px] text-ink-2"
              >
                {item}
              </li>
            ))}
          </ul>
          <h3 className="label mt-8">Skills shown</h3>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {project.skills.map((skill) => (
              <li key={skill} className="text-[14px] text-ink-2">
                {skill}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ProofLinks project={project} caseStudy={false} />
          </div>
        </Block>

        <nav
          aria-label="More projects"
          className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              data-identity={previous.identity}
              className="group flex flex-col gap-1 bg-surface p-5 hover:bg-surface-2"
            >
              <span className="label inline-flex items-center gap-1.5">
                <ArrowLeft className="size-3.5" /> Previous · {pad(previous.index)}
              </span>
              <span className="text-[16px] font-medium text-ink group-hover:text-id">{previous.name}</span>
            </Link>
          ) : (
            <span aria-hidden="true" className="hidden bg-surface-2 sm:block" />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              data-identity={next.identity}
              className="group flex flex-col items-end gap-1 bg-surface p-5 text-right hover:bg-surface-2"
            >
              <span className="label inline-flex items-center gap-1.5">
                Next · {pad(next.index)} <ArrowRight className="size-3.5" />
              </span>
              <span className="text-[16px] font-medium text-ink group-hover:text-id">{next.name}</span>
            </Link>
          ) : (
            <Link
              href="/#projects"
              className="group flex flex-col items-end gap-1 bg-surface p-5 text-right hover:bg-surface-2"
            >
              <span className="label inline-flex items-center gap-1.5">
                Back <ArrowRight className="size-3.5" />
              </span>
              <span className="text-[16px] font-medium text-ink">All projects</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
