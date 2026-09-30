import Link from "next/link";
import type { Project } from "@/data/types";
import { ArrowRight, ArrowUpRight } from "./icons";

const pill =
  "inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line bg-surface px-3 text-[13px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink";

/** Home-page links: text, not buttons, so a card's figure stays its heaviest mark. */
const textLink = "inline-flex h-8 items-center gap-1 text-[13px] text-muted transition-colors hover:text-ink";

export function ProofLinks({
  project,
  caseStudy = true,
  backend = true,
  note = true,
  compact = false,
}: {
  project: Project;
  caseStudy?: boolean;
  /** Include the project's backend link (API docs, MCP metadata); the home page leaves it to the case study. */
  backend?: boolean;
  /** Show the project's cold-start note under the links, where it has one. */
  note?: boolean;
  /** Text links for the home page's cards and rows. */
  compact?: boolean;
}) {
  const other = compact ? textLink : pill;
  return (
    <div className="flex flex-col gap-2">
      <ul
        className={compact ? "flex flex-wrap items-center gap-x-4" : "flex flex-wrap gap-2"}
        aria-label={`${project.name} links`}
      >
        {caseStudy ? (
          <li>
            <Link
              href={`/projects/${project.slug}`}
              prefetch={false}
              className={
                compact
                  ? "link-underline inline-flex h-8 items-center gap-1 text-[13px] font-medium text-ink"
                  : "inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] bg-ink px-3 text-[13px] font-medium text-bg transition-opacity hover:opacity-85"
              }
            >
              Case study <ArrowRight className="size-3.5" />
              <span className="sr-only">: {project.name}</span>
            </Link>
          </li>
        ) : null}
        <li>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={other}>
            Live demo <ArrowUpRight className="size-3.5 text-faint" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={other}>
            GitHub <ArrowUpRight className="size-3.5 text-faint" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
        {backend && project.backendUrl ? (
          <li>
            <a href={project.backendUrl} target="_blank" rel="noopener noreferrer" className={other}>
              {project.backendLabel ?? "Backend"} <ArrowUpRight className="size-3.5 text-faint" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ) : null}
      </ul>
      {note && project.demoNote ? (
        <p className="max-w-[26rem] text-pretty text-[12px] leading-[1.5] text-muted">
          {project.demoNote}
        </p>
      ) : null}
    </div>
  );
}
