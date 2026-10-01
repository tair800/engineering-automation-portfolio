"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { profile } from "@/data/profile";
import { ArrowUpRight, Close, Menu } from "./icons";
import { navItems } from "./nav-items";

/**
 * The small-screen menu. Its only animation is a short CSS entrance (`menu-in` in globals.css),
 * which the reduced-motion rule there switches off — an animation library for one fade was most
 * of the JavaScript every page shipped.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-sunk hover:text-ink"
      >
        {open ? <Close /> : <Menu />}
      </button>
      {open ? (
        <nav
          id={panelId}
          aria-label="Primary"
          className="absolute inset-x-0 top-full animate-[menu-in_150ms_ease-out] border-b border-line bg-bg"
        >
          <ul className="container-page flex flex-col py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center border-b border-line text-[15px] text-ink-2 last:border-0 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {[
              { href: profile.githubUrl, label: "GitHub" },
              { href: profile.linkedinUrl, label: "LinkedIn" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center gap-1.5 border-b border-line text-[15px] text-ink-2 hover:text-ink"
                >
                  {link.label} <ArrowUpRight className="text-faint" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
