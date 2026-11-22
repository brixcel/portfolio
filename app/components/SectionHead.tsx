import type { ReactNode } from "react";

/** The shared section opener: index label, title, short lede. (Terminal prompts stay in the hero and Contact only.) */
export default function SectionHead({
  id,
  index,
  title,
  sub,
  aside,
}: {
  id: string;
  index: string;
  title: ReactNode;
  sub?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="sec-head">
      <div>
        <p className="sec-index">{index}</p>
        <h2 id={id} className="sec-title">
          {title}
        </h2>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
      {aside && <div className="sec-aside">{aside}</div>}
    </header>
  );
}
