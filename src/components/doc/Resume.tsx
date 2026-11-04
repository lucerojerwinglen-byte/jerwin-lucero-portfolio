import Image from "next/image";
import { Copy, Mail, MapPin } from "lucide-react";
import { site } from "@/content/data/site";
import { experience } from "@/content/data/experience";
import { skills } from "@/content/data/skills";
import { education } from "@/content/data/education";
import { credentials } from "@/content/data/credentials";
import { pages, alsoBuiltLine } from "@/lib/document/document";
import { Footnotes, ProjectEntry, SectionHead, Sheet } from "./parts";
import { TechGlyph } from "./TechGlyph";

/** The two printed pages. Everything in here is on paper: run `npm run pdf` after changes. */
export function Resume() {
  return (
    <>
      <Sheet page="1">
        <header className="head">
          <div>
            <h1>{site.name}</h1>
            <p className="role">
              <b>{site.focus}</b> — {site.title}
            </p>
            <p className="contact">
              <span>
                <MapPin className="ico" aria-hidden="true" />
                {site.location}
              </span>
              <span>
                <Mail className="ico" aria-hidden="true" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <button
                  type="button"
                  className="copy"
                  data-copy={site.email}
                  data-copy-label="Email address copied"
                  aria-label="Copy email address"
                >
                  <Copy className="ico" aria-hidden="true" />
                </button>
              </span>
              <span>
                <TechGlyph name="GitHub" />
                <a href={site.social.github} target="_blank" rel="noreferrer">
                  {site.social.github.replace("https://", "")}
                </a>
              </span>
            </p>
          </div>
          <div className="idbox">
            <Image
              className="photo"
              src="/images/jerwin-hero.png"
              alt={`Portrait of ${site.shortName}`}
              width={168}
              height={168}
              priority
            />
            <div className="qr-wrap print-only">
              {/* Static SVG: points at the live version, printed only. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="qr" src="/qr.svg" alt={`QR code to ${site.domain}`} />
              <span>Live version: {site.domain}</span>
            </div>
          </div>
        </header>

        <section aria-labelledby="summary">
          <SectionHead id="summary">Summary</SectionHead>
          <p className="summary">{site.summary}</p>
        </section>

        <section aria-labelledby="work">
          <SectionHead id="work">Selected work</SectionHead>
          {pages.one.selected.map((p) => (
            <ProjectEntry key={p.slug} p={p} />
          ))}
        </section>

        <section aria-labelledby="experience">
          <SectionHead id="experience">Experience</SectionHead>
          {experience.map((e) => (
            <div key={e.id} className="entry" data-entry={e.id}>
              <div className="eh">
                <h3>
                  {e.role}{" "}
                  <span className="org">
                    · {e.org}
                    {e.location ? `, ${e.location}` : ""}
                  </span>
                </h3>
                <span className="meta">{e.period}</span>
              </div>
              {e.bullets ? (
                <ul className="pts">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="desc">{e.summary}</p>
              )}
              {e.note && (
                <p className="note" style={{ top: 30 }}>
                  {e.note}
                </p>
              )}
            </div>
          ))}
        </section>

        <Footnotes list={pages.one.footnotes} />
      </Sheet>

      <Sheet page="2">
        <section aria-labelledby="more-work" style={{ marginTop: 0 }}>
          <SectionHead id="more-work">More work</SectionHead>
          {pages.two.more.map((p) => (
            <ProjectEntry key={p.slug} p={p} />
          ))}
        </section>

        <section aria-labelledby="research">
          <SectionHead id="research">Research</SectionHead>
          {pages.two.research.map((p) => (
            <ProjectEntry key={p.slug} p={p} />
          ))}
          <p className="entry also" data-entry={pages.two.also.map((p) => p.slug).join(" ")}>
            {alsoBuiltLine()}
          </p>
        </section>

        <section aria-labelledby="skills">
          <SectionHead id="skills">Skills</SectionHead>
          <dl className="grid2">
            {skills.map((g) => (
              <div key={g.category} style={{ display: "contents" }}>
                <dt>{g.category}</dt>
                <dd>
                  {g.items.map((s, i) => (
                    <span key={s.name}>
                      {i > 0 && ", "}
                      {s.usedIn?.length ? (
                        <button
                          type="button"
                          className="sk"
                          data-ev={s.usedIn.join(" ")}
                          aria-pressed="false"
                          title={`Show where I used ${s.name}`}
                        >
                          {s.name}
                        </button>
                      ) : (
                        s.name
                      )}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="education">
          <SectionHead id="education">Education</SectionHead>
          {education.map((e) => (
            <div key={e.credential} className="entry">
              <div className="eh">
                <h3>
                  {e.credential} <span className="org">· {e.school}</span>
                </h3>
                <span className="meta">{e.period}</span>
              </div>
            </div>
          ))}
        </section>

        <section aria-labelledby="credentials">
          <SectionHead id="credentials">Credentials</SectionHead>
          <dl className="grid2">
            {credentials.map((c) => (
              <div key={c.title} style={{ display: "contents" }}>
                <dt>{c.date}</dt>
                <dd>
                  {c.title} · {c.issuer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Footnotes list={pages.two.footnotes} />
      </Sheet>
    </>
  );
}
