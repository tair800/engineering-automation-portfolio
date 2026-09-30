import Link from "next/link";
import type { Project } from "@/data/types";
import { ArrowRight, ArrowUpRight } from "./icons";

const pill =
  "inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line bg-surface px-3 text-[13px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink";

export function ProofLinks({
  project,
  caseStudy = true,
}: {
  project: Project;
  caseStudy?: boolean;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`${project.name} links`}>
      <li>
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={pill}>
          Live demo <ArrowUpRight className="size-3.5 text-faint" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </li>
      <li>
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={pill}>
          GitHub <ArrowUpRight className="size-3.5 text-faint" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </li>
      {project.backendUrl ? (
        <li>
          <a href={project.backendUrl} target="_blank" rel="noopener noreferrer" className={pill}>
            {project.backendLabel ?? "Backend"} <ArrowUpRight className="size-3.5 text-faint" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ) : null}
      {caseStudy ? (
        <li>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] bg-ink px-3 text-[13px] font-medium text-bg transition-opacity hover:opacity-85"
          >
            Case study <ArrowRight className="size-3.5" />
            <span className="sr-only">: {project.name}</span>
          </Link>
        </li>
      ) : null}
    </ul>
  );
}
