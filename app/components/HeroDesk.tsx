import Image from "next/image";

// What's on the desk: real work only. Desk and IoT RC car photos slot in here
// as new items once they exist; keep every item a real artifact, never a stand-in.
export default function HeroDesk() {
  return (
    <div className="desk">
      <div className="desk-light" aria-hidden="true" />
      <ul className="desk-items" aria-label="On my desk">
        <li className="desk-item desk-item--cicd">
          <a href="#egoist-cicd" className="desk-sheet desk-sheet--label-top">
            <span className="desk-print">
              <Image
                src="/assets/cicd-1.svg"
                alt="Diagram of the Egoist Labs deployment pipelines"
                width={1200}
                height={750}
                unoptimized
              />
            </span>
            <span className="desk-label">Egoist Labs CI/CD</span>
          </a>
        </li>
        <li className="desk-item desk-item--synctask">
          <a href="#synctask" className="desk-sheet">
            <span className="desk-print">
              <Image
                src="/assets/synctask-2.png"
                alt="Synctask task board"
                width={1439}
                height={779}
                sizes="(max-width: 900px) 70vw, 420px"
                priority
              />
            </span>
            <span className="desk-label">Synctask</span>
          </a>
        </li>
        <li className="desk-item desk-item--photo">
          <figure className="desk-sheet desk-photo">
            <Image
              src="/assets/profile.jpg"
              alt="Portrait of Brexcel Joe Orias"
              width={552}
              height={552}
              sizes="(max-width: 900px) 34vw, 190px"
              priority
            />
            <figcaption>Brexcel, Antipolo</figcaption>
          </figure>
        </li>
      </ul>
    </div>
  );
}
