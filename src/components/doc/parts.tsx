import type { ReactNode } from "react";
import { ArrowUpRight, Link2, Lock, Plus } from "lucide-react";
import type { Project } from "@/types/content";
import { footnoteFor, formatRevDate, type Footnote } from "@/lib/document/document";
import { site } from "@/content/data/site";
import lock from "@/content/resume-lock.json";
import { Tags, TechGlyph } from "./TechGlyph";

export const revision = `Rev. ${lock.rev} · ${formatRevDate(lock.date)}`;

export function Sheet({ page, children }: { page: "1" | "2"; children: ReactNode }) {
  return (
    <article className="sheet" data-page={page} aria-label={`Page ${page} of 2`}>
      <div className="runhead" aria-hidden="true">
        <span>{site.name} — Résumé</span>
        <span>{revision}</span>
      </div>
      {children}
      <div className="folio" aria-hidden="true">
        <span>{site.domain}</span>
        <span>{page} / 2</span>
      </div>
    </article>
  );
}

/** h2 with a hover "copy link to this section" anchor (web only). */
export function SectionHead({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id}>
      {children}
      <a className="anchor" href={`#${id}`} aria-label={`Copy link to ${String(children)}`} data-tip="Copy link">
        <Link2 className="ico" aria-hidden="true" />
      </a>
    </h2>
  );
}

function Meta({ p }: { p: Project }) {
  return (
    <span className="meta">
      {p.year} ·{" "}
      {p.liveUrl ? (
        <span className="live">live</span>
      ) : p.internal ? (
        <>
          <Lock className="ico" aria-hidden="true" />
          internal
        </>
      ) : p.repoUrl ? (
        <>
          <TechGlyph name="GitHub" />
          open source
        </>
      ) : null}
    </span>
  );
}

function FnMark({ fn }: { fn: Footnote }) {
  return (
    <sup className="fn">
      <a href={`#fn${fn.n}`} data-url={fn.links.map((l) => l.label).join("  ·  ")} aria-label={`Footnote ${fn.n}`}>
        {fn.n}
      </a>
    </sup>
  );
}

export function ProjectEntry({ p }: { p: Project }) {
  const fn = footnoteFor(p.slug);
  const href = p.liveUrl ?? p.repoUrl;
  return (
    <div className="entry" data-entry={p.slug}>
      <div className="eh">
        <h3>
          {href && !p.internal ? (
            <a href={href} target="_blank" rel="noreferrer">
              {p.title}
              <ArrowUpRight className="ext" aria-hidden="true" />
            </a>
          ) : (
            p.title
          )}
          {fn && <FnMark fn={fn} />}
          {p.context && <span className="org"> · {p.context}</span>}
        </h3>
        {p.section === "research" ? <span className="meta">{p.year}</span> : <Meta p={p} />}
      </div>
      <p className="desc">
        {p.description} <Tags tags={p.tags} />
      </p>
      {p.details && (
        <details className="more">
          <summary>
            <Plus className="ico" aria-hidden="true" />
            Details
          </summary>
          <p>{p.details}</p>
        </details>
      )}
      {p.note && <p className="note">{p.note}</p>}
    </div>
  );
}

export function Footnotes({ list }: { list: Footnote[] }) {
  if (!list.length) return null;
  return (
    <div className="footnotes">
      <ol>
        {list.map((f) => (
          <li key={f.n} id={`fn${f.n}`}>
            <b>{f.n}</b>
            {f.links.map((l, i) => (
              <span key={l.href}>
                {i > 0 && " · "}
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
