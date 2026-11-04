import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  CircleDashed,
  Download,
  Mail,
  ScanSearch,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { ToolStrip } from "@/components/ToolStrip";
import { FitPresetChips } from "@/components/FitPresetChips";
import { site } from "@/content/data/site";
import { projects } from "@/content/data/projects";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";
import { credentials } from "@/content/data/credentials";
import type { FitStatus } from "@/lib/fit/capabilities";
import { reconcile } from "@/lib/fit/match";
import { presets } from "@/lib/fit/presets";
import { cn } from "@/lib/utils";

// The fit tile previews the real QA preset result, computed at build time.
const preview = reconcile(presets[0].text);

const FEATURED = ["lovewin", "barato", "team-ops-suite"];
const featured = FEATURED.map((slug) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`overview: unknown featured project "${slug}"`);
  return p;
});

const degree = education.find((e) => e.level === "Tertiary");

const STAMP: Record<FitStatus, { text: string; icon: typeof Circle; className: string }> = {
  verified: { text: "Verified", icon: CheckCircle2, className: "bg-ok-soft text-verified" },
  partial: { text: "Partial", icon: CircleDashed, className: "bg-partial-soft text-partial" },
  gap: { text: "Not yet", icon: Circle, className: "bg-gray-100 text-gray-600" },
};

/** "Aug 2025 – Present" → "2025—", "2021 – 2025" → "2025", "2024" → "2024". */
function shortPeriod(period: string): string {
  const years = period.match(/\d{4}/g) ?? [];
  if (/present/i.test(period)) return `${years[0]}—`;
  return years[years.length - 1] ?? period;
}

const TILE = "tile rounded-[20px] border border-gray-200 bg-surface p-5 sm:p-6";

function TileTitle({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="group flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{children}</h2>
      <ArrowUpRight className="h-4 w-4 text-gray-400 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
    </a>
  );
}

export function Overview() {
  const pct = (n: number) => `${(n / preview.rows.length) * 100}%`;

  return (
    <section id="about" className="scroll-mt-24 px-5 pb-6 pt-6 sm:px-8 lg:px-10 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">
        {/* Phone/tablet ID card; on desktop it lives in the rail. */}
        <div className="reveal d1 mb-8 flex items-center gap-4 lg:hidden">
          <Image
            src="/images/jerwin-hero.png"
            alt={site.name}
            width={160}
            height={160}
            priority
            className="h-16 w-16 rounded-full bg-gray-100 object-cover object-top"
          />
          <div className="min-w-0">
            <p className="font-display text-lg leading-tight">{site.shortName}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-verified">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Open to QA, data &amp; AI roles
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="reveal d2 text-balance text-[2.3rem] font-bold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
              I verify things for a living.
              <br />
              Now I <span className="hl-mark">build</span> them.
            </h1>
            <p className="reveal d3 mt-5 max-w-[34rem] text-[16px] leading-relaxed text-gray-600">
              {site.title} at Sagility and Cum Laude CS grad, building QA, data and AI tools
              that keep data right.
            </p>
          </div>
          <div className="reveal d4 flex shrink-0 flex-col items-start gap-3 md:items-end">
            <a
              href="#fit"
              className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-3 text-sm font-semibold text-cta-ink transition-opacity duration-200 hover:opacity-85 active:scale-[0.97]"
            >
              <ScanSearch className="h-4 w-4" />
              Check my fit for your role
            </a>
            <div className="flex items-center gap-4 text-[13px] font-medium text-gray-600">
              <a href="#contact" className="inline-flex items-center gap-1.5 hover:text-ink">
                <Mail className="h-3.5 w-3.5" /> Hire me
              </a>
              <a href={site.resumePdfPath} download className="inline-flex items-center gap-1.5 hover:text-ink">
                <Download className="h-3.5 w-3.5" /> Résumé
              </a>
              <a
                href={site.social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-ink"
              >
                <GithubIcon className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="reveal d4">
          <ToolStrip />
        </div>

        <div className="reveal d5 mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Fit check: the largest tile, and the only one with the accent. */}
          <article className={cn(TILE, "flex flex-col md:col-span-3 md:row-span-2")}>
            <TileTitle href="#fit">Check my fit for your role</TileTitle>
            <p className="mt-1 text-[13px] text-gray-500">
              Paste a job post; every requirement gets stamped, with evidence. Runs in your browser.
            </p>
            <p className="mt-6 font-display text-[64px] leading-none tabular-nums">
              <span className="hl-mark">{preview.counts.verified}</span>
              <span className="text-gray-400">/{preview.rows.length}</span>
            </p>
            <p className="mt-2 text-[13px] text-gray-500">
              requirements verified on a sample {presets[0].label} post
            </p>
            <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
              <span className="fit-bar-seg bg-verified" style={{ width: pct(preview.counts.verified) }} />
              <span
                className="fit-bar-seg bg-partial"
                style={{ width: pct(preview.counts.partial), "--i": 1 } as React.CSSProperties}
              />
            </div>
            <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
              {preview.rows.slice(0, 5).map((row, i) => {
                const s = STAMP[row.capability.status];
                return (
                  <li key={row.capability.id} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                    <span className="min-w-0 truncate">
                      <span className="mr-3 font-mono text-[11px] tabular-nums text-gray-400">
                        R-{String(i + 1).padStart(2, "0")}
                      </span>
                      {row.capability.label}
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        s.className
                      )}
                    >
                      <s.icon className="h-3 w-3" aria-hidden="true" />
                      {s.text}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-5">
              <p className="mb-2 text-[12px] text-gray-500">Try a sample post:</p>
              <FitPresetChips />
            </div>
          </article>

          {/* Projects */}
          <article className={cn(TILE, "md:col-span-3")}>
            <TileTitle href="#projects">Selected projects</TileTitle>
            <ul className="mt-3 divide-y divide-gray-200">
              {featured.map((p) => {
                const href = p.liveUrl ?? p.repoUrl;
                const body = (
                  <>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{p.title}</span>
                      <span className="block truncate text-[12px] text-gray-500">
                        {p.tags.slice(0, 3).join(" · ")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 text-[12px]",
                        p.liveUrl ? "text-verified" : "text-gray-500"
                      )}
                    >
                      {p.liveUrl && <span className="h-1.5 w-1.5 rounded-full bg-verified" aria-hidden="true" />}
                      {p.liveUrl ? "Live ↗" : p.internal ? "Internal" : "Code ↗"}
                    </span>
                  </>
                );
                const cls = "flex items-center justify-between gap-3 py-3";
                return (
                  <li key={p.slug}>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className={cn(cls, "group")}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>

          {/* Experience */}
          <article className={cn(TILE, "md:col-span-3")}>
            <TileTitle href="#experience">Experience</TileTitle>
            <ul className="mt-3 divide-y divide-gray-200 text-[13px]">
              {experience.map((e) => (
                <li key={e.org} className="grid grid-cols-[3.5rem_1fr] py-2.5">
                  <span className="font-mono text-[11px] tabular-nums text-gray-400">{shortPeriod(e.period)}</span>
                  <span>
                    <span className="block font-medium">{e.role}</span>
                    <span className="block text-gray-500">{e.org.split(" (")[0]}</span>
                  </span>
                </li>
              ))}
              {degree && (
                <li className="grid grid-cols-[3.5rem_1fr] py-2.5">
                  <span className="font-mono text-[11px] tabular-nums text-gray-400">{shortPeriod(degree.period)}</span>
                  <span>
                    <span className="block font-medium">BS Computer Science, Cum Laude</span>
                    <span className="block text-gray-500">{degree.school}</span>
                  </span>
                </li>
              )}
            </ul>
          </article>

          {/* Credentials */}
          <article className={cn(TILE, "md:col-span-3")}>
            <TileTitle href="#credentials">Credentials</TileTitle>
            <ul className="mt-3 divide-y divide-gray-200 text-[13px]">
              {credentials.slice(0, 3).map((c) => (
                <li key={c.title} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span className="min-w-0 truncate font-medium">{c.title.split(/[:—]/)[0].trim()}</span>
                  <span className="shrink-0 text-[12px] text-gray-500">{c.date.replace(/^.*?(\d{4})$/, "$1")}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Contact */}
          <article className={cn(TILE, "flex flex-col md:col-span-3")}>
            <TileTitle href="#contact">Hiring for QA, data or AI?</TileTitle>
            <p className="mt-1 text-[13px] text-gray-500">
              Based in Metro Manila, UTC+8. Send a message or download my résumé.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-[13px] font-medium">
              <a
                href="#contact"
                className="rounded-full bg-cta px-4 py-2 text-cta-ink transition-opacity hover:opacity-85 active:scale-[0.97]"
              >
                Send a message
              </a>
              <a href={`mailto:${site.email}`} className="text-gray-600 hover:text-ink">
                Email ↗
              </a>
              <a href={site.resumePdfPath} download className="text-gray-600 hover:text-ink">
                Résumé PDF
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
