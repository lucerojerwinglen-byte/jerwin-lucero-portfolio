import Link from "next/link";
import { ArrowRight, Award, GraduationCap, Layers, Mail, ScrollText, Sparkles } from "lucide-react";
import { site } from "@/content/data/site";
import { projects } from "@/content/data/projects";
import { experience } from "@/content/data/experience";
import { credentials } from "@/content/data/credentials";
import {
  affiliations,
  anthropicCerts,
  badges,
  featured,
  hero,
  issuerLogo,
  method,
  recommendations,
  stats,
  toolsIUse,
  type Section,
} from "@/content/home/home";
import type { Credential, Project } from "@/types/content";
import { getAllPosts } from "@/lib/blog";
import { formatRevDate } from "@/lib/document/document";
import { getContributions } from "@/lib/github";
import { dotLevels, DOT_SIZE } from "@/lib/home/dots";
import { ProjectStack } from "./ProjectStack";
import { Portrait } from "./Portrait";
import { StackExplorer } from "./StackExplorer";
import { stackGroups, usedInLink } from "@/lib/home/used-in";
import { CopyEmail, TourAgain } from "./Buttons";
import { Faq } from "./Faq";
import { Logo, LogoMark } from "./Logo";
import { parseHero } from "@/lib/home/hero";
import { logoFor, requireLogo } from "@/lib/logos";
import { ReplyForm } from "@/components/web/ReplyForm";

/** Hero markup → text with a typed title, logo pills, highlighted words and stacked logos. */
function HeroText({ text }: { text: string }) {
  return (
    <>
      {parseHero(text).map((t, i) => {
        switch (t.kind) {
          case "text":
            return t.text;
          case "typed":
            // Full text is in the HTML from the start; CSS only reveals it (loops; off under reduced motion).
            // The invisible ghost reserves the full width, so the text around it never shifts while it types.
            return (
              <span key={i} className="typed-slot">
                <span className="typed-ghost" aria-hidden="true">
                  {t.text}
                </span>
                <span className="typed" style={{ "--chars": t.text.length } as React.CSSProperties}>
                  {t.text}
                </span>
              </span>
            );
          case "logo":
            return <Logo key={i} name={t.name} className="pill" />;
          case "word":
            return (
              <span key={i} className="pill word">
                {t.text}
              </span>
            );
          case "stack":
            return (
              <span key={i} className="pill stackpill">
                <span className="ai-stack" aria-hidden="true">
                  {t.names.map((n) => (
                    <span key={n} className="ai-dot">
                      <LogoMark spec={requireLogo(n)} label={n} />
                    </span>
                  ))}
                </span>
                {t.label}
                <span className="sr-only"> ({t.names.join(", ")})</span>
              </span>
            );
        }
      })}
    </>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <Portrait name={site.shortName} />
      <div>
        <h1>{site.shortName}</h1>
        {hero.paragraphs.map((p) => (
          <p key={p}>
            <HeroText text={p} />
          </p>
        ))}
        <p className="byday">
          <HeroText text={hero.caption} />
        </p>
        <div className="social">
          <a href={site.social.github} target="_blank" rel="noreferrer">
            <Logo name="GitHub" /> ↗
          </a>
          <Link href="/resume" data-tour="resume">
            résumé ↗
          </Link>
          <a href={site.resumePdfPath} download={site.resumePdfName}>
            pdf ↗
          </a>
          <a href={`mailto:${site.email}`}>email ↗</a>
        </div>
      </div>
    </section>
  );
}

const badgeIcons = [GraduationCap, ScrollText, Award];

export function Facts() {
  return (
    <>
      <div className="facts" data-tour="facts">
        <div className="row">
          {badges.map((b, i) => {
            const Icon = badgeIcons[i % badgeIcons.length];
            return (
              <div key={b.title} className="cell badge">
                <Icon className="ico" aria-hidden="true" />
                <span>
                  <b>{b.title}</b>
                  <span className="caps">{b.sub}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="row">
          {stats.map((s) => (
            <a key={s.label} className="cell stat" href={s.href}>
              <span className="v">
                {s.value}
                <sup>↗</sup>
              </span>
              <span className="caps">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="divider-dots" aria-hidden="true" />
    </>
  );
}

export function NumberedSection({ s, children }: { s: Section & { n: string }; children: React.ReactNode }) {
  return (
    <section className="sec" id={s.id} aria-labelledby={`${s.id}-h`}>
      <div className="sec-head">
        <h2 id={`${s.id}-h`}>
          {s.n} <span>—</span> {s.title}
        </h2>
        {s.more && (
          <Link href={s.more.href}>
            {s.more.label} <ArrowRight className="ico" aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

const monthYear = (iso: string) => formatRevDate(iso).replace(/^\d+ /, "");
const cleanExcerpt = (s: string) => s.replace(/^Draft\s*[—-]\s*/, "").replace(/^./, (c) => c.toUpperCase());

export function Blog() {
  return (
    <ul className="list">
      {getAllPosts().map((p) => (
        <li key={p.slug}>
          <Link className="post" href={`/blog/${p.slug}`}>
            <span className="t">{p.title}</span>
            <span className="d">{monthYear(p.date)}</span>
            <span className="ex">{cleanExcerpt(p.excerpt)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProjectTags({ tags }: { tags: string[] }) {
  return (
    <span className="ltags">
      {tags.map((t) => (
        <Logo key={t} name={t} className="ltag" />
      ))}
    </span>
  );
}

/** The project's own links, or the internal note. Shared by the cards and /projects. */
/** `sheet`: also link to the project's case study (ADR 0007); off inside the case study itself. */
export function ProjectLinks({ p, sheet = true }: { p: Project; sheet?: boolean }) {
  return (
    <div className="plinks">
      {sheet && (
        <Link href={`/projects/${p.slug}`} scroll={false}>
          case study →
        </Link>
      )}
      {p.internal && <span>employer-internal · no code or link</span>}
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
  );
}

/** A featured project's icon (real app icon or the generic stack), or null if it isn't featured. */
export function featuredIcon(slug: string): React.ReactNode | null {
  const card = featured.find((c) => c.kind === "project" && c.slug === slug);
  if (card?.kind !== "project") return null;
  return "file" in card.icon ? (
    // eslint-disable-next-line @next/next/no-img-element -- a 36px app icon
    <img src={card.icon.file} alt="" className="picon-img" />
  ) : (
    <Layers className="ico" aria-hidden="true" />
  );
}

const statusOf = (p: Project) => (p.internal ? "internal" : p.liveUrl ? "live" : "open source");

/** The card body, rendered on the server so logos never ship the whole logo set to the browser. */
function CardBody({ p, icon }: { p: Project; icon: React.ReactNode }) {
  return (
    <>
      <div className="ptags">
        <span className="ptag solid">{statusOf(p)}</span>
      </div>
      <div className="ptitle">
        <span className="picon" aria-hidden="true">
          {icon}
        </span>
        {p.title}
      </div>
      <p className="pdesc">{p.description}</p>
      <ProjectTags tags={p.tags.slice(0, 3)} />
      <ProjectLinks p={p} />
    </>
  );
}

export function Projects() {
  const cards = featured.map((c) => {
    if (c.kind === "placeholder") {
      return {
        key: "placeholder",
        label: c.title,
        placeholder: true,
        content: (
          <>
            <div className="ptags">
              <span className="ptag">coming soon</span>
            </div>
            <div className="ptitle">
              <span className="picon" aria-hidden="true">
                <Sparkles className="ico" />
              </span>
              {c.title}
            </div>
            <p className="pdesc">{c.text}</p>
          </>
        ),
      };
    }
    const p = projects.find((x) => x.slug === c.slug);
    if (!p) throw new Error(`featured card "${c.slug}" matches no project in src/content/data/projects.ts`);
    return { key: p.slug, label: p.title, content: <CardBody p={p} icon={featuredIcon(p.slug)} /> };
  });
  return <ProjectStack cards={cards} />;
}

/** The tools strip: an endless row that pauses on hover; a plain wrapped row with reduced motion. */
export function ToolsStrip() {
  const row = (copy: boolean) => (
    <ul className="tools-row" aria-hidden={copy || undefined}>
      {toolsIUse.map((t) => (
        <li key={t}>
          <Logo name={t} className="htag" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="tools" data-tour="tools">
      <div className="sub-head">
        <span className="caps">Tools I use</span>
      </div>
      <div className="tools-viewport">
        <div className="tools-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

/** Method (ADR 0007): "Ask. Prove. Ship.", each step linked to its evidence. */
export function Method() {
  return (
    <>
      <p className="method-lede">
        {method.map((s) => `${s.title}.`).join(" ")}
      </p>
      <ol className="method">
        {method.map((s, i) => {
          const external = s.href.startsWith("http");
          return (
            <li key={s.title}>
              <span className="caps">0{i + 1}</span>
              <h3>{s.title}.</h3>
              <p>{s.text}</p>
              <a href={s.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {s.proof} {external ? "↗" : <ArrowRight className="ico" aria-hidden="true" />}
              </a>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function Experience() {
  return (
    <>
      <ul className="list">
        {experience.map((e) => (
          <li key={e.id} className="job">
            <span className="y">{e.period.match(/\d{4}/)?.[0]}</span>
            <span className="r">{e.role}</span>
            <span className="o">{e.org}</span>
          </li>
        ))}
      </ul>
      <div className="sub-head">
        <span className="caps">Stack</span>
        <Link className="caps" href="/experience#stack">
          View all →
        </Link>
      </div>
      <StackExplorer
        moreHref="/experience#stack"
        groups={stackGroups.map((g) => ({
          label: g.label,
          tags: g.items.map((s) => ({
            key: s.name,
            node: <Logo name={s.name} />,
            usedIn: (s.usedIn ?? []).map(usedInLink),
          })),
        }))}
      />
      <ToolsStrip />
    </>
  );
}

export function IssuerLogo({ issuer }: { issuer: string }) {
  const brand = logoFor(issuer); // a brand mark from the logo set (Anthropic), else a file or initials
  if (brand) {
    return (
      <span className="issuer-mark" aria-hidden="true">
        <LogoMark spec={brand} label={issuer} />
      </span>
    );
  }
  const file = issuerLogo(issuer);
  return file ? (
    // eslint-disable-next-line @next/next/no-img-element -- small local logo; alt is empty because the issuer is printed below it
    <img className="issuer-logo" src={file} alt="" />
  ) : (
    <span className="logo mono" aria-hidden="true">
      {issuer.slice(0, 3)}
    </span>
  );
}

export function CredentialCard({ c }: { c: Credential }) {
  const head = (
    <>
      <IssuerLogo issuer={c.issuer} />
      <span className="ct">{c.title}</span>
      <span className="caps">
        {c.issuer} · {c.date}
      </span>
    </>
  );
  // Verify page and PDF copy: two links, so the card itself is not a link (no nested anchors).
  if (c.verifyUrl && c.pdfPath) {
    return (
      <div className="card">
        {head}
        <span className="verify card-links">
          <a href={c.verifyUrl} target="_blank" rel="noreferrer" aria-label={`Verify ${c.title} (opens the issuer's page)`}>
            verify ↗
          </a>
          <a href={c.pdfPath} target="_blank" rel="noreferrer" aria-label={`${c.title} certificate, PDF`}>
            pdf ↗
          </a>
        </span>
      </div>
    );
  }
  const inner = (
    <>
      {head}
      <span className="verify">{c.verifyUrl ? "‹ verify ›" : c.kind}</span>
    </>
  );
  return c.verifyUrl ? (
    <a className="card" href={c.verifyUrl} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <div className="card">{inner}</div>
  );
}

/** Homepage: the four Anthropic certificates, plus the Civil Service result and the Git & GitHub seminar (both have real logos). */
const homeCredentials = [...anthropicCerts, ...credentials.filter((c) => c.issuer === "CSC" || c.issuer === "BU College of Science")];

export function Certifications() {
  return (
    <div className="cards">
      {homeCredentials.map((c) => (
        <CredentialCard key={c.title} c={c} />
      ))}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export function Recommendations() {
  return (
    <div className="cards">
      {recommendations.map((r, i) => {
        const real = r.kind === "real";
        const who = (
          <>
            <b>{real ? r.name : "Open slot"}</b>
            <span className="caps">{real ? r.role : "Coming soon"}</span>
          </>
        );
        return (
          <figure key={i} className={real ? "card quote" : "card quote placeholder"} style={{ margin: 0 }}>
            <span className="mark" aria-hidden="true">“</span>
            <q>{r.quote}</q>
            <figcaption className="who">
              <span className="ini" aria-hidden="true">
                {real ? initials(r.name) : "?"}
              </span>
              {real ? (
                <a href={r.source} target="_blank" rel="noreferrer">
                  {who}
                </a>
              ) : (
                <span>{who}</span>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

export function Affiliations() {
  return (
    <ul className="htags" style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
      {affiliations.map((a) => (
        <li key={a.name}>
          <a className="htag" href={a.source} target="_blank" rel="noreferrer">
            {a.name} · {a.role}
          </a>
        </li>
      ))}
    </ul>
  );
}

export async function GitHub() {
  const data = await getContributions();
  if (!data) {
    return (
      <p className="gh-off">
        The contribution graph is unavailable right now.{" "}
        <a href={site.social.github} style={{ textDecoration: "underline" }}>
          See it on GitHub ↗
        </a>
      </p>
    );
  }
  const days = data.weeks.flat();
  const levels = dotLevels(days.map((d) => d.count));
  return (
    <div className="gh">
      <a href={site.social.github} target="_blank" rel="noreferrer" aria-label={`${data.total} contributions in the last year, on GitHub`}>
        <div className="gh-grid" aria-hidden="true">
          {days.map((d, i) => (
            <i key={d.date} data-l={levels[i]} style={{ "--s": DOT_SIZE[levels[i]] } as React.CSSProperties} title={`${d.count} on ${d.date}`} />
          ))}
        </div>
      </a>
      <span className="caps">{data.total.toLocaleString("en-US")} contributions in the last year</span>
    </div>
  );
}

export function Contact() {
  return (
    <section className="hello" aria-labelledby="hello">
      <span className="caps">Get in touch</span>
      <h2 id="hello">say hello</h2>
      <p>
        Building something, hiring, or just want to talk shop? I usually reply within a day (UTC+8). References available on request.
      </p>
      <div className="row">
        <span className="mono">{site.email}</span>
        <CopyEmail email={site.email} />
        <a className="hbtn solid" href={`mailto:${site.email}`}>
          <Mail className="ico" aria-hidden="true" />
          Open mail app
        </a>
      </div>
      <Faq />
      <ReplyForm />
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <span>{site.shortName}</span>
      <TourAgain />
    </footer>
  );
}
