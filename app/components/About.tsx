export default function About() {
  return (
    <section
      id="about"
      className="section-pad"
      style={{ maxWidth: 1180, margin: "0 auto", padding: "110px 24px" }}
    >
      <div
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 44, alignItems: "start" }}
      >
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: 0, letterSpacing: "-.02em" }}>About</h2>
        <div>
          <p
            style={{
              fontSize: "clamp(17px, 1.7vw, 22px)",
              lineHeight: 1.6,
              letterSpacing: ".01em",
              margin: "0 0 28px",
              textWrap: "pretty",
            }}
          >
            4th-year Computer Engineering student working toward becoming a fullstack
            developer, sharpening that craft at Egoist Labs with the goal of ranking among
            the top 1% of software engineers.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span className="tag tag-accent">Full-stack</span>
            <span className="tag tag-accent-2">Computer Engineering</span>
            <span className="tag tag-outline">Egoist Labs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
