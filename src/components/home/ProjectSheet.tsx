// Project sheets (ADR 0007): one case-study body, shown in a sheet (click) or a full page (cold link).
import { projectSheet } from "@/lib/home/sheets";
import { ProjectLinks, ProjectTags, featuredIcon } from "./Sections";
import { FlowDiagram } from "./FlowDiagram";

/** The case study itself. Server component; the same markup in the sheet and on the full page. */
export function CaseStudy({ slug, lede = true }: { slug: string; lede?: boolean }) {
  const sheet = projectSheet(slug);
  if (!sheet) return null;
  const { project: p, caseStudy } = sheet;
  return (
    <div className="case">
      <div className="case-head">
        <span className="picon" aria-hidden="true">
          {featuredIcon(p.slug) ?? p.title[0]}
        </span>
        <span className="caps">
          {[p.internal ? "internal" : p.liveUrl ? "live" : "open source", p.context, p.year].filter(Boolean).join(" · ")}
        </span>
      </div>
      {lede && <p className="case-lede">{p.description}</p>}
      {caseStudy ? (
        <dl className="case-steps">
          <dt>The problem</dt>
          <dd>{caseStudy.problem}</dd>
          <dt>What I built</dt>
          <dd>{caseStudy.built}</dd>
          <dt>How I proved it</dt>
          <dd>{caseStudy.proved}</dd>
        </dl>
      ) : (
        p.details && <p className="pdesc">{p.details}</p>
      )}
      {/* CPT Tools has no screenshots (employer's), so a drawing of public facts stands in. */}
      {slug === "team-ops-suite" && <FlowDiagram />}
      {p.note && <p className="case-note">{p.note}</p>}
      <ProjectTags tags={p.tags} />
      <ProjectLinks p={p} sheet={false} />
    </div>
  );
}
