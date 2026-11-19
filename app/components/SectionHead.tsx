import type { ReactNode } from "react";

/** The shared section opener: index label, terminal prompt, giant title with its full stop, short lede. */
export default function SectionHead({
  id,
  index,
  prompt,
  title,
  sub,
  aside,
}: {
  id: string;
  index: string;
  prompt: string;
  title: ReactNode;
  sub?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="sec-head">
      <div>
        <p className="sec-index">{index}</p>
        <p className="sec-prompt" aria-hidden="true">
          &gt; {prompt}
        </p>
        <h2 id={id} className="sec-title">
          {title}
          <span aria-hidden="true">.</span>
        </h2>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
      {aside && <div className="sec-aside">{aside}</div>}
    </header>
  );
}
