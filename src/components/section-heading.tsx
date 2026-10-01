import type { ReactNode } from "react";

/** A home-page section's heading, with at most one plain line beneath it. */
export function SectionHeading({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-[44rem]">
      <h2
        id={id}
        className="text-balance text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]"
      >
        {title}
      </h2>
      {children ? <p className="mt-2 text-pretty text-[15px] leading-[1.6] text-muted">{children}</p> : null}
    </div>
  );
}

/** Sections are separated by space rather than rules. */
export function Section({
  id,
  labelledBy,
  children,
}: {
  id?: string;
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy}>
      <div className="container-page py-12 sm:py-16">{children}</div>
    </section>
  );
}
