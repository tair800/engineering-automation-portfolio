import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { getProject, projects } from "@/data/projects";
import { pad } from "@/lib/format";
import { OgGrid, ogColors, ogFonts, ogIdentity, ogSize } from "@/lib/og";

export const alt = "Case study summary: project name, tagline and status";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug) ?? projects[0];
  const accent = ogIdentity[project.identity];
  const negative = project.status.kind === "negative-result";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: ogColors.bg,
          fontFamily: "Geist",
          color: ogColors.ink,
        }}
      >
        <OgGrid />
        <div style={{ display: "flex", height: 6, background: accent }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 72px 52px" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 2, color: ogColors.muted, textTransform: "uppercase" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: accent, marginRight: 16 }} />
            <span style={{ color: ogColors.ink, marginRight: 16 }}>{pad(project.index)}</span>
            {project.domain}
          </div>
          <div style={{ fontSize: 68, fontWeight: 600, letterSpacing: -2.5, marginTop: 36, lineHeight: 1.05 }}>
            {project.name}
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 24, lineHeight: 1.5, color: ogColors.ink2, marginTop: 26, maxWidth: 1040 }}>
            {project.tagline}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "auto", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "Geist Mono",
                fontSize: 17,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: negative ? ogColors.fail : ogColors.ink2,
                border: `1px solid ${negative ? "rgba(248,113,113,0.45)" : ogColors.line}`,
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: 9, background: negative ? ogColors.fail : ogColors.pass, marginRight: 12 }} />
              {`${project.status.label} · ${project.status.deployment}`}
            </div>
            <div style={{ fontFamily: "Geist Mono", fontSize: 18, color: ogColors.muted }}>
              {`${profile.name} · ${profile.role}`}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
