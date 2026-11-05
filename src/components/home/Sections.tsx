import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, BadgeCheck, Building2, Database, FileSpreadsheet, GraduationCap, Mail, ScrollText, Sparkles, Wrench } from "lucide-react";
import { site } from "@/content/data/site";
import { projects } from "@/content/data/projects";
import { experience } from "@/content/data/experience";
import { credentials } from "@/content/data/credentials";
import { skills } from "@/content/data/skills";
import { affiliations, badges, recommendations, stats, type Section } from "@/content/home/home";
import { getAllPosts } from "@/lib/blog";
import { formatRevDate } from "@/lib/document/document";
import { getContributions } from "@/lib/github";
import { dotLevels, DOT_SIZE } from "@/lib/home/dots";
import { ProjectStack } from "./ProjectStack";
import { CopyEmail, TourAgain } from "./Buttons";

const Pill = ({ icon: Icon, children }: { icon: typeof Wrench; children: React.ReactNode }) => (
  <span className="pill">
    <Icon className="ico" aria-hidden="true" />
    {children}
  </span>
);

export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="portrait">
        <Image src="/images/jerwin-hero.png" alt={`Portrait of ${site.shortName}`} width={440} height={420} priority />
      </div>
      <div>
        <h1>{site.shortName}</h1>
        <p>
          I’m a <Pill icon={Building2}>Workday</Pill> transactions analyst moving into <Pill icon={BadgeCheck}>QA</Pill>,{" "}
          <Pill icon={Database}>data</Pill> &amp; <Pill icon={Sparkles}>AI</Pill>.
        </p>
        <p>
          I verify HR data for a living and build the <Pill icon={Wrench}>tools</Pill> I wish I had. I love turning{" "}
          <Pill icon={FileSpreadsheet}>messy exports</Pill> into things my team actually uses.
        </p>
        <div className="social">
          <a href={site.social.github} target="_blank" rel="noreferrer">
            github ↗
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

export function Projects() {
  return <ProjectStack projects={projects.filter((p) => p.section === "selected")} />;
}

const stackTags = skills
  .filter((g) => !["Spoken", "Tools"].includes(g.category))
  .flatMap((g) => g.items.map((i) => i.name.replace(/\s*\(.*\)$/, "")))
  .filter((n) => !/testing|manual|engineering|explainable|assisted/i.test(n))
  .slice(0, 12);

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
        <Link className="caps" href="/resume#skills">
          View all →
        </Link>
      </div>
      <div className="htags">
        {stackTags.map((t) => (
          <span key={t} className="htag">
            {t}
          </span>
        ))}
        <Link className="htag more" href="/resume#skills">
          + more
        </Link>
      </div>
    </>
  );
}

export function Certifications() {
  return (
    <div className="cards">
      {credentials.slice(0, 3).map((c) => {
        const inner = (
          <>
            <span className="logo mono" aria-hidden="true">
              {c.issuer.slice(0, 3)}
            </span>
            <span className="ct">{c.title}</span>
            <span className="caps">
              {c.issuer} · {c.date}
            </span>
            <span className="verify">{c.verifyUrl ? "‹ verify ›" : c.kind}</span>
          </>
        );
        return c.verifyUrl ? (
          <a key={c.title} className="card" href={c.verifyUrl} target="_blank" rel="noreferrer">
            {inner}
          </a>
        ) : (
          <div key={c.title} className="card">
            {inner}
          </div>
        );
      })}
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
      <p>Hiring for QA, data or AI, or just want to talk shop? I usually reply within a day (UTC+8).</p>
      <div className="row">
        <span className="mono">{site.email}</span>
        <CopyEmail email={site.email} />
        <a className="hbtn solid" href={`mailto:${site.email}`}>
          <Mail className="ico" aria-hidden="true" />
          Open mail app
        </a>
        <Link className="hbtn" href="/resume#contact">
          Send a message <ArrowUpRight className="ico" aria-hidden="true" />
        </Link>
      </div>
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
