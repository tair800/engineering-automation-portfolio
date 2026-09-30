import type { Project } from "@/data/types";

/** Problem, built and hard part, one sentence each, for a gallery entry. */
export function Brief({ project, className = "" }: { project: Project; className?: string }) {
  const rows: [string, string][] = [
    ["Problem", project.brief.problem],
    ["Built", project.brief.built],
    ["Hard part", project.brief.hardPart],
  ];
  return (
    <dl className={`flex flex-col gap-4 ${className}`}>
      {rows.map(([term, text]) => (
        <div key={term}>
          <dt className="label">{term}</dt>
          <dd className="mt-1 text-[14px] leading-[1.6] text-ink-2">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
