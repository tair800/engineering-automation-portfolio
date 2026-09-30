import Link from "next/link";
import { profile } from "@/data/profile";
import { ArrowUpRight } from "./icons";
import { MobileNav } from "./mobile-nav";
import { navItems } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/80">
      <div className="container-page relative flex h-14 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2.5 rounded-sm">
          <span className="text-[15px] font-semibold tracking-tight text-ink">{profile.name}</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:inline">
            {profile.role}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:text-ink lg:px-3"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:text-ink md:inline-flex"
          >
            GitHub <ArrowUpRight className="size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
