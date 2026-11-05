"use client";

import { useState } from "react";
import type { Project } from "@/types/content";
import { fanOffset } from "@/lib/home/fan";

/** Cards fanned like a hand: the front one is readable, click a side card to bring it forward. 4+ cards: the rest wait out of sight. */
export function ProjectStack({ projects }: { projects: Project[] }) {
  const [front, setFront] = useState(0);

  return (
    <>
      <div className="stack-wrap" data-tour="projects">
        {projects.map((p, i) => {
          const offset = fanOffset(i, front, projects.length);
          const isFront = offset === 0;
          const status = p.internal ? "internal" : p.liveUrl ? "live" : "open source";
          return (
            <div
              key={p.slug}
              className="pcard"
              data-pos={offset ?? "hidden"}
              aria-hidden={offset === null || undefined}
              inert={offset === null || undefined}
              role={isFront ? "group" : "button"}
              tabIndex={isFront ? -1 : 0}
              aria-label={isFront ? p.title : `Show ${p.title}`}
              onClick={() => !isFront && setFront(i)}
              onKeyDown={(e) => {
                if (isFront || (e.key !== "Enter" && e.key !== " ")) return;
                e.preventDefault();
                setFront(i);
              }}
            >
              <div className="ptags">
                <span className="ptag solid">{status}</span>
                {p.tags.slice(0, 2).map((t) => (
                  <span key={t} className="ptag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="ptitle">
                <span className="picon" aria-hidden="true">
                  {p.title[0]}
                </span>
                {p.title}
              </div>
              <p className="pdesc">{p.description}</p>
              {isFront && (p.liveUrl || p.repoUrl) && (
                <div className="plinks">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer">
                      open ↗
                    </a>
                  )}
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noreferrer">
                      code ↗
                    </a>
                  )}
                </div>
              )}
              {isFront && p.internal && <div className="plinks">employer-internal · no code or link</div>}
            </div>
          );
        })}
      </div>
      <div className="stack-dots" role="group" aria-label="Choose a project">
        {projects.map((p, i) => (
          <button key={p.slug} type="button" aria-label={p.title} aria-current={i === front} onClick={() => setFront(i)} />
        ))}
      </div>
    </>
  );
}
