import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";

/**
 * Shared social preview image (Open Graph and X), generated at build time in
 * the site's colors with the official app icon. Inner pages reference it
 * explicitly through baseOpenGraph() in src/lib/metadata.ts.
 */
const { meta } = getDictionary();

export const alt = meta.ogImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read once at module level (as in the Next.js docs), so the image is prerendered at build time.
const iconSrc = `data:image/png;base64,${(await readFile(join(process.cwd(), "src/app/apple-icon.png"))).toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: siteConfig.themeColor,
          backgroundImage:
            "radial-gradient(circle at 18% 0%, rgba(91, 79, 240, 0.45), transparent 55%), radial-gradient(circle at 100% 100%, rgba(79, 140, 255, 0.22), transparent 50%)",
          color: "#f5f5f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
          <img src={iconSrc} width={76} height={76} alt="" style={{ borderRadius: 18 }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.06, letterSpacing: -2, maxWidth: 940 }}>
            {meta.ogImage.headline}
          </div>
          <div style={{ fontSize: 32, color: "#a1a1aa" }}>{meta.ogImage.subline}</div>
        </div>

        <div
          style={{
            display: "flex",
            width: 180,
            height: 6,
            borderRadius: 3,
            backgroundImage: "linear-gradient(90deg, #5b4ff0, #4f8cff)",
          }}
        />
      </div>
    ),
    size,
  );
}
