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
        <Link href="/" className="rounded-sm text-[15px] font-semibold tracking-tight text-ink">
          {profile.name}
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
          {[
            { href: profile.githubUrl, label: "GitHub" },
            { href: profile.linkedinUrl, label: "LinkedIn" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-[13px] text-muted transition-colors hover:text-ink md:inline-flex"
            >
              {link.label} <ArrowUpRight className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
