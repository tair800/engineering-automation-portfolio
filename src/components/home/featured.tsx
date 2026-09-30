import Link from "next/link";
import { flagships } from "@/data/projects";
import type { Project } from "@/data/types";
import { pad } from "@/lib/format";
import { Brief } from "../brief";
import { ProofLinks } from "../proof-links";
import { Section, SectionHeading } from "../section-heading";
import { StatusBadge } from "../status-badge";
import { EvidenceVisual } from "../visuals/evidence-visual";

function PanelHeader({ project }: { project: Project }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
      <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        <span aria-hidden="true" className="size-2 rounded-[2px] bg-id" />
        <span className="text-ink">{pad(project.index)}</span>
        <span>{project.domain}</span>
      </p>
      <StatusBadge status={project.status} />
    </header>
  );
}

function Title({ project, id }: { project: Project; id: string }) {
  return (
    <>
      <h3
        id={id}
        className="text-balance text-[24px] font-semibold leading-8 tracking-[-0.02em] text-ink sm:text-[26px]"
      >
        <Link href={`/projects/${project.slug}`} prefetch={false} className="hover:text-id">
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 text-pretty text-[15px] leading-[1.6] text-muted">{project.tagline}</p>
    </>
  );
}

/**
 * The three flagships share a frame but not a layout: the ledger's chaos grid runs full width
 * like an operations dashboard, the broker keeps its console beside the argument, and the
 * reconciler puts its evidence first, the way a reconciliation workspace would.
 */
function FlagshipPanel({ project }: { project: Project }) {
  const titleId = `${project.slug}-feature`;
  const wide = project.identity === "ledger";
  const evidenceFirst = project.identity === "bordereaux";

  return (
    <article
      data-identity={project.identity}
      aria-labelledby={titleId}
      className="overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-[var(--shadow)]"
    >
      <PanelHeader project={project} />
      {wide ? (
        <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Title project={project} id={titleId} />
              <div className="mt-6">
                <ProofLinks project={project} />
              </div>
            </div>
            <Brief project={project} className="lg:col-span-8 lg:grid lg:grid-cols-3 lg:gap-8" />
          </div>
          <EvidenceVisual visual={project.visual} />
        </div>
      ) : (
        <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8">
          <div className={`flex flex-col lg:col-span-5 ${evidenceFirst ? "lg:order-2" : ""}`}>
            <Title project={project} id={titleId} />
            <Brief project={project} className="mt-6" />
            <div className="mt-7">
              <ProofLinks project={project} />
            </div>
          </div>
          <div className={`min-w-0 lg:col-span-7 ${evidenceFirst ? "lg:order-1" : ""}`}>
            <EvidenceVisual visual={project.visual} />
          </div>
        </div>
      )}
    </article>
  );
}

export function Featured() {
  return (
    <Section id="featured" labelledBy="featured-title">
      <SectionHeading id="featured-title" label="Featured engineering" title="Where a wrong action costs money">
        Finance operations, agent authorisation and insurance reconciliation, each shown beside
        the experiment that could have proven it wrong.
      </SectionHeading>
      <div className="mt-12 flex flex-col gap-8">
        {flagships.map((project) => (
          <FlagshipPanel key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
