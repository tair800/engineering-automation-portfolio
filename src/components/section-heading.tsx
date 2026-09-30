import type { ReactNode } from "react";

export function SectionHeading({
  id,
  index,
  label,
  title,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5">
        <p className="label">
          <span className="text-faint">{index}</span>
          <span className="mx-2 text-faint">/</span>
          {label}
        </p>
        <h2
          id={id}
          className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[32px]"
        >
          {title}
        </h2>
      </div>
      {children ? (
        <div className="text-[15px] leading-[1.65] text-muted md:col-span-6 md:col-start-7 md:pt-7">
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
  className = "",
}: {
  id?: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`border-t border-line ${className}`}>
      <div className="container-page py-16 sm:py-20 lg:py-24">{children}</div>
    </section>
  );
}
