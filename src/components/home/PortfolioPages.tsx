// The "see more" pages (ADR 0006): /projects, /experience, /certifications. Same look as the
// homepage, so visitors stay on the portfolio. Links to /resume or the PDF must say so.
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/content/data/projects";
import { site } from "@/content/data/site";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";
import { credentials } from "@/content/data/credentials";
import { skills } from "@/content/data/skills";
import { toolsIUse } from "@/content/home/home";
import { searchItems } from "@/lib/home/search-items";
import type { Project, ProjectSection } from "@/types/content";
import { Sidebar } from "./Sidebar";
import { Overlays } from "./Overlays";
import { CredentialCard, Footer, ProjectLinks, ProjectTags, featuredIcon } from "./Sections";
import { Logo } from "./Logo";

export function PageShell({ title, lede, children }: { title: string; lede: string; children: React.ReactNode }) {
  return (
    <div className="home">
      <Sidebar onHome={false} />
      <main className="main">
        <div className="col page">
          <Link className="back mono" href="/">
            <ArrowLeft className="ico" aria-hidden="true" /> home
          </Link>
          <h1>{title}</h1>
          <p className="page-lede">{lede}</p>
          {children}
          <p className="paper">
            Prefer paper? <Link href="/resume">Read the résumé</Link> or{" "}
            <a href={site.resumePdfPath} download={site.resumePdfName}>
              download the pdf
            </a>
            .
          </p>
          <Footer />
        </div>
      </main>
      <Overlays items={searchItems("/")} />
    </div>
  );
}

const GROUPS: { section: ProjectSection; title: string }[] = [
  { section: "selected", title: "Selected" },
  { section: "more", title: "More work" },
  { section: "research", title: "Research" },
  { section: "also", title: "Also built" },
];

/** "also built" entries are phrases written to sit inside a sentence; on their own line they need a capital and a full stop. */
const asSentence = (p: Project) => (p.section === "also" ? `${p.description[0].toUpperCase()}${p.description.slice(1)}.` : p.description);

export function ProjectsList() {
  return (
    <>
      {GROUPS.map((g) => {
        const list = projects.filter((p) => p.section === g.section);
        if (!list.length) return null;
        return (
          <section key={g.section} className="sec" aria-labelledby={`g-${g.section}`}>
            <div className="sec-head">
              <h2 id={`g-${g.section}`}>{g.title.toLowerCase()}</h2>
            </div>
            <ul className="list">
              {list.map((p) => (
                <li key={p.slug} id={p.slug} className="prow">
                  <span className="picon" aria-hidden="true">
                    {featuredIcon(p.slug) ?? p.title[0]}
                  </span>
                  <div>
                    <div className="prow-head">
                      <b>{p.title}</b>
                      {p.context && <span className="caps">{p.context}</span>}
                      <span className="caps">{p.year}</span>
                    </div>
                    <p className="pdesc">{asSentence(p)}</p>
                    {p.details && <p className="pdesc">{p.details}</p>}
                    <ProjectTags tags={p.tags} />
                    <ProjectLinks p={p} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

export function ExperienceList() {
  return (
    <>
      <section className="sec" aria-labelledby="jobs">
        <div className="sec-head">
          <h2 id="jobs">work</h2>
        </div>
        <ul className="list">
          {experience.map((e) => (
            <li key={e.id} id={e.id} className="xrow">
              <div className="prow-head">
                <b>{e.role}</b>
              </div>
              <span className="caps">
                {e.org} · {e.period}
                {e.location ? ` · ${e.location}` : ""}
              </span>
              {e.bullets ? (
                <ul className="xbullets">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="pdesc">{e.summary}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="sec" id="stack" aria-labelledby="stack-h">
        <div className="sec-head">
          <h2 id="stack-h">stack</h2>
        </div>
        {skills.map((g) => (
          <div key={g.category} className="skill-group">
            <span className="caps">{g.category}</span>
            <div className="htags">
              {g.items.map((s) => (
                <Logo key={s.name} name={s.name} className="htag" />
              ))}
            </div>
          </div>
        ))}
        <div className="skill-group">
          <span className="caps">Tools I use</span>
          <div className="htags">
            {toolsIUse.map((t) => (
              <Logo key={t} name={t} className="htag" />
            ))}
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="edu">
        <div className="sec-head">
          <h2 id="edu">education</h2>
        </div>
        <ul className="list">
          {education.map((e) => (
            <li key={e.credential} className="job">
              <span className="y">{e.period.match(/\d{4}(?!.*\d{4})/)?.[0]}</span>
              <span className="r">{e.credential}</span>
              <span className="o">{e.school}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function CertificationsList() {
  return (
    <div className="cards">
      {credentials.map((c) => (
        <CredentialCard key={c.title} c={c} />
      ))}
    </div>
  );
}
