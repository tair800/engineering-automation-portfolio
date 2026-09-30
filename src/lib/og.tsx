import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Shared pieces for the generated Open Graph images, rendered once at build time. */
export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules", "geist", "dist", "fonts");

export async function ogFonts() {
  const [regular, semibold, mono] = await Promise.all([
    readFile(join(fontDir, "geist-sans", "Geist-Regular.ttf")),
    readFile(join(fontDir, "geist-sans", "Geist-SemiBold.ttf")),
    readFile(join(fontDir, "geist-mono", "GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

export const ogColors = {
  bg: "#0c0d10",
  line: "#25272d",
  grid: "rgba(255,255,255,0.045)",
  ink: "#ececee",
  ink2: "#c6c8ce",
  muted: "#9a9ea8",
  fail: "#f87171",
  pass: "#4ade80",
};

/** The dark-theme identity hues, matching globals.css. */
export const ogIdentity: Record<string, string> = {
  ledger: "#2dd4bf",
  market: "#9a9ea8",
  callsite: "#9a9ea8",
  authz: "#fb923c",
  resolver: "#9a9ea8",
  bordereaux: "#60a5fa",
  parts: "#e3c16f",
};

export function OgGrid() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        backgroundImage: `linear-gradient(to right, ${ogColors.grid} 1px, transparent 1px), linear-gradient(to bottom, ${ogColors.grid} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    />
  );
}
