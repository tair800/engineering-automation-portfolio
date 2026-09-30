import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { pad } from "@/lib/format";
import { OgGrid, ogColors, ogFonts, ogIdentity, ogSize } from "@/lib/og";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: ogColors.bg,
          fontFamily: "Geist",
          color: ogColors.ink,
        }}
      >
        <OgGrid />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 72px", width: 640 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Geist Mono", fontSize: 18, letterSpacing: 2, color: ogColors.muted, textTransform: "uppercase" }}>
              Portfolio · public engineering work
            </div>
            <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -3, marginTop: 28, lineHeight: 1 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 34, color: ogColors.muted, marginTop: 14 }}>{profile.role}</div>
            <div style={{ fontSize: 26, lineHeight: 1.4, color: ogColors.ink2, marginTop: 36 }}>
              {profile.headline}
            </div>
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 17, color: ogColors.muted }}>
            Seven projects · measured results and limitations, published
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "auto",
            padding: "0 64px 0 0",
            width: 470,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${ogColors.line}`, borderRadius: 12, background: "rgba(19,20,24,0.92)" }}>
            {projects.map((project, i) => (
              <div
                key={project.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "13px 20px",
                  borderTop: i === 0 ? "none" : `1px solid ${ogColors.line}`,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 2, background: ogIdentity[project.identity], marginRight: 14 }} />
                <div style={{ fontFamily: "Geist Mono", fontSize: 15, color: ogColors.muted, width: 34 }}>{pad(project.index)}</div>
                <div style={{ fontSize: 19, color: ogColors.ink }}>{project.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
