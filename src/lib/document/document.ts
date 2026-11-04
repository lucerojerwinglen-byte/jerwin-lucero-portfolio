// How the content layer is laid out as the 2-page résumé: what goes on which page,
// footnote numbering, and small formatting helpers. Pure: no React, no Node APIs,
// so the page, the tests and the PDF script all agree.
import { projects } from "@/content/data/projects";
import type { Project, ProjectSection } from "@/types/content";

export interface FootnoteLink {
  href: string;
  label: string;
}

export interface Footnote {
  n: number;
  slug: string;
  links: FootnoteLink[];
}

const bySection = (s: ProjectSection) => projects.filter((p) => p.section === s);

/** "https://github.com/a/b/" → "github.com/a/b"; `short` collapses the GitHub owner. */
export function linkLabel(url: string, short = false): string {
  const bare = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return short ? bare.replace(/^github\.com\/[^/]+\//, "github.com/…/") : bare;
}

function linksOf(p: Project): FootnoteLink[] {
  if (p.internal) return [];
  const urls = [p.liveUrl, p.repoUrl].filter((u): u is string => Boolean(u));
  // Two links share one footnote line, so the second (GitHub) one is shortened.
  return urls.map((href, i) => ({ href, label: linkLabel(href, urls.length > 1 && i > 0) }));
}

function number(list: Project[], start: number): Footnote[] {
  const out: Footnote[] = [];
  for (const p of list) {
    const links = linksOf(p);
    if (links.length) out.push({ n: start + out.length, slug: p.slug, links });
  }
  return out;
}

const selected = bySection("selected");
const more = bySection("more");
const research = bySection("research");
const one = number(selected, 1);
const two = number([...more, ...research], one.length + 1);

/** The two printed pages. Page breaks are fixed by design, and checked by `npm run pdf`. */
export const pages = {
  one: { selected, footnotes: one },
  two: { more, research, also: bySection("also"), footnotes: two },
};

export function footnoteFor(slug: string): Footnote | undefined {
  return [...one, ...two].find((f) => f.slug === slug);
}

export function alsoBuiltLine(): string {
  const parts = pages.two.also.map((p) => `${p.description} (${p.year})`);
  const joined = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return `Also built: ${joined}.`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-04" → "4 Nov 2026". Parsed by hand: `new Date()` would shift it by timezone. */
export function formatRevDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Sections in reading order: drives the outline and the scroll spy. */
export const outline: { page: "1" | "2" | "A"; items: [id: string, label: string][] }[] = [
  { page: "1", items: [["summary", "Summary"], ["work", "Selected work"], ["experience", "Experience"]] },
  {
    page: "2",
    items: [
      ["more-work", "More work"],
      ["research", "Research"],
      ["skills", "Skills"],
      ["education", "Education"],
      ["credentials", "Credentials"],
    ],
  },
  { page: "A", items: [["writing", "Writing"], ["contact", "Reply"], ["appendix-a", "Appendix A"]] },
 ];
