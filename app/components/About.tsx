import Reveal from "./Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="section-pad"
      style={{ maxWidth: 1180, margin: "0 auto", padding: "110px 24px" }}
    >
      <Reveal
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 44, alignItems: "start" }}
      >
        <div className="text-mask-reveal">
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: 0, letterSpacing: "-.02em" }}>About</h2>
        </div>
        <div>
          <p
            className="stagger-1"
            style={{
              fontSize: "clamp(17px, 1.7vw, 22px)",
              lineHeight: 1.6,
              letterSpacing: ".01em",
              margin: "0 0 28px",
              textWrap: "pretty",
            }}
          >
            4TH YEAR COMPUTER ENGINEERING STUDENT ASPIRING TO BECOME A FULLSTACK DEVELOPER,
            LEARNING TO BECOME A TOP 1% SOFTWARE ENGINEER IN EGOIST LABS
          </p>
          <div className="stagger-2" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span className="tag tag-accent">Full-stack</span>
            <span className="tag tag-accent-2">Computer Engineering</span>
            <span className="tag tag-outline">Egoist Labs</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
