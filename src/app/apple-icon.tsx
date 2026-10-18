import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon generated from the temporary WideCode mark (see components/brand/logo.tsx). */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #5b4ff0, #4f8cff)",
      }}
    >
      <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
        <path
          d="M7 10l4 12 5-9 5 9 4-12"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
