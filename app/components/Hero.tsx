import Reveal from "./Reveal";
import IdBadge from "./IdBadge";

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "0 24px",
        minHeight: "calc(100svh - 74px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr .95fr",
          gap: 40,
          alignItems: "center",
          width: "100%",
          padding: "36px 0 56px",
        }}
      >
        <Reveal>
          <div>
            <p
              className="stagger-1"
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "var(--color-accent-700)",
                margin: "0 0 18px",
              }}
            >
              Brexcel Joe M. Orias
            </p>
            <div className="text-mask-reveal">
              <h1
                style={{
                  fontSize: "clamp(32px, 4.4vw, 60px)",
                  lineHeight: 1.06,
                  margin: "0 0 22px",
                  letterSpacing: "-.02em",
                  maxWidth: "15ch",
                }}
              >
                Software Developer
              </h1>
            </div>
            <p
              className="stagger-2"
              style={{
                fontSize: "clamp(17px, 1.6vw, 21px)",
                maxWidth: "34ch",
                margin: "0 0 30px",
                color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
                textWrap: "pretty",
              }}
            >
              &ldquo;Building software to solve problems I actually encounter.&rdquo;
            </p>
            <div className="hero-actions stagger-3" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="#projects" className="btn btn-primary" style={{ textDecoration: "none" }}>
                See the projects
              </a>
              <a href="#contact" className="btn btn-secondary" style={{ textDecoration: "none" }}>
                Get in touch
              </a>
            </div>
          </div>
        </Reveal>
        <IdBadge />
      </div>
    </section>
  );
}
