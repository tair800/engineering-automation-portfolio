import type { ReactNode } from "react";

/** The small label and the heading every home-page section opens with. */
export function SectionTitle({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <>
      <p className="label flex items-center gap-2">
        <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
        {label}
      </p>
      <h2
        id={id}
        className="mt-3 text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[32px]"
      >
        {title}
      </h2>
    </>
  );
}

export function SectionHeading({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <SectionTitle id={id} label={label} title={title} />
      </div>
      {children ? (
        <div className="text-pretty text-[15px] leading-[1.65] text-muted lg:col-span-6 lg:col-start-7 lg:pt-7">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  labelledBy,
  children,
  compact = false,
  className = "",
}: {
  id?: string;
  labelledBy: string;
  children: ReactNode;
  /** Less vertical room, for the short sections at the foot of the page. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`border-t border-line ${className}`}>
      <div className={`container-page ${compact ? "py-10 lg:py-12" : "py-12 sm:py-14 lg:py-16"}`}>
        {children}
      </div>
    </section>
  );
}
