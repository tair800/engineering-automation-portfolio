import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141519",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <g stroke="#f6f6f3" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9.5h9M10.5 9.5V23" />
            <path d="M16.5 23 21.5 9.5 26.5 23M18.4 18h6.2" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
