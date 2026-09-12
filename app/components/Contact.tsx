import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section
      id="contact"
      style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-divider)" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 24px" }}>
        <Reveal
          className="two-col"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "end" }}
        >
          <div>
            <h2 style={{ fontSize: "clamp(34px, 4.6vw, 56px)", margin: "0 0 14px", letterSpacing: "-.02em" }}>
              Let&rsquo;s build something.
            </h2>
            <p style={{ margin: 0, fontSize: 17, color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
              Open to internships, freelance work and collaboration.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <a href="mailto:brexcel14@gmail.com" className="contact-row">
              brexcel14@gmail.com
              <span style={{ color: "var(--color-accent-700)" }}>Email →</span>
            </a>
            <a
              href="https://github.com/brixcel"
              target="_blank"
              rel="noopener"
              className="contact-row"
            >
              github.com/brixcel
              <span style={{ color: "var(--color-accent-700)" }}>GitHub →</span>
            </a>
          </div>
        </Reveal>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 72,
            paddingTop: 26,
            borderTop: "1px solid var(--color-divider)",
            fontSize: 13,
            color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
          }}
        >
          <span>Brexcel Joe M. Orias — Computer Engineering</span>
          <span>Synctask · UrsacHub</span>
        </div>
      </div>
    </section>
  );
}
