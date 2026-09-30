import type { ReactNode } from "react";
import { ArrowUpRight } from "./icons";

export function ExternalLink({
  href,
  children,
  className = "",
  icon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {children}
      {icon ? <ArrowUpRight className="size-3.5 shrink-0 opacity-70" /> : null}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
