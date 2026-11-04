"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import { outline } from "@/lib/document/document";

/** PDF-style bookmarks in the left gutter (wide screens), highlighting the section in view. */
export function Outline() {
  const [active, setActive] = useState<string>("summary");

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        const hit = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-64px 0px -70% 0px" },
    );
    outline.flatMap((g) => g.items).forEach(([id]) => {
      const h = document.getElementById(id);
      if (h) io.observe(h);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="toc" aria-label="Contents">
      <h2>
        <ListTree className="ico" aria-hidden="true" />
        Contents
      </h2>
      <ol>
        {outline.map((g) => (
          <li key={g.page}>
            <p className="pg">{g.page === "A" ? "Web only" : `Page ${g.page}`}</p>
            <ol>
              {g.items.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      <div className="shortcuts" aria-label="Keyboard shortcuts">
        <kbd>Ctrl K</kbd>
        <span>Find</span>
        <kbd>T</kbd>
        <span>Reading lamp</span>
        <kbd>N</kbd>
        <span>Margin notes</span>
        <kbd>Esc</kbd>
        <span>Close</span>
      </div>
    </nav>
  );
}
