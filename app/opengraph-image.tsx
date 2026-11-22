import { ImageResponse } from "next/og";

export const alt = "Brexcel Orias, software engineer. Software Engineer Intern at Egoist Labs, Computer Engineering at URS Antipolo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Brexcel Orias";
const ROLE = "software engineer";
const LINE = "Software Engineer Intern at Egoist Labs · Computer Engineering, URS Antipolo";
const MARK = "//";

// Google Fonts serves TTF to clients without a browser user agent; `text=` keeps each subset tiny.
async function googleFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null; // offline build: fall back to the bundled sans
  }
}

export default async function Image() {
  const [heavy, mono] = await Promise.all([
    googleFont("Inter+Tight", 800, NAME + ROLE + MARK),
    googleFont("JetBrains+Mono", 500, LINE),
  ]);
  const fonts = [
    ...(heavy ? [{ name: "Inter Tight", data: heavy, weight: 800 as const }] : []),
    ...(mono ? [{ name: "JetBrains Mono", data: mono, weight: 500 as const }] : []),
  ];
  const ink = "#131312";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#e9e9e6",
          color: ink,
          fontFamily: "Inter Tight",
          padding: "72px 80px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -120,
            fontSize: 760,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.12em",
            color: "rgba(19,19,18,0.1)",
          }}
        >
          {MARK}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 56, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.045em" }}>{NAME}</div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                marginTop: 18,
                color: "rgba(19,19,18,0.6)",
              }}
            >
              {ROLE}
            </div>
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 21,
              paddingTop: 24,
              borderTop: `2px solid ${ink}`,
            }}
          >
            {LINE}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
