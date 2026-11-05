import { projects } from "@/content/data/projects";

// Homepage-only content (ADR 0005). Kept outside src/content/data/ on purpose: that folder
// is part of the résumé PDF fingerprint, and nothing here is printed.
// Rule (PRODUCT.md): never fabricate. Every badge and stat cites its evidence; checked by home.test.ts.

export type SectionId =
  | "blog"
  | "projects"
  | "experience"
  | "certifications"
  | "recommendations"
  | "affiliations"
  | "github";

export interface Section {
  id: SectionId;
  title: string;
  /** Hidden sections are skipped and the rest renumber, so there is never a gap. */
  hidden?: boolean;
  more?: { label: string; href: string };
}

/** "certifications" → "Certifications", for nav and search. */
export const sectionLabel = (s: { title: string }) => s.title[0].toUpperCase() + s.title.slice(1);

export function numberSections<T extends { hidden?: boolean }>(sections: T[]): (T & { n: string })[] {
  return sections.filter((s) => !s.hidden).map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0") }));
}

/** Badge row under the hero. `evidence` must appear verbatim in the content layer. */
export const badges = [
  { title: "Cum Laude", sub: "BS Computer Science", evidence: "BS Computer Science, Cum Laude" },
  { title: "Civil Service", sub: "Professional level", evidence: "Civil Service Exam, Professional Level" },
  { title: "App Builders PH", sub: "Lovewin · listed", evidence: "Listed on App Builders PH" },
];

export interface Stat {
  value: string;
  label: string;
  href: string;
  evidence: { slug: string; text: string };
}

// shortcut: "8" and "58" are typed by hand; the test only checks their evidence text exists.
// Upgrade when the suite changes size: derive them from a field on the project instead.
export const stats: Stat[] = [
  {
    value: "8",
    label: "apps in production",
    href: "/resume#work",
    evidence: { slug: "team-ops-suite", text: "Eight connected apps" },
  },
  {
    value: String(projects.filter((p) => p.liveUrl).length),
    label: "live apps",
    href: "#projects",
    evidence: { slug: "lovewin", text: "end-to-end-encrypted" },
  },
  {
    value: "58",
    label: "recorded decisions",
    href: "/resume#work",
    evidence: { slug: "team-ops-suite", text: "58 recorded architecture decisions" },
  },
];

export type Recommendation =
  | { kind: "placeholder"; quote: string }
  | { kind: "real"; quote: string; name: string; role: string; source: string };

// Placeholders until real recommendations exist (ADR 0005). Replace one by changing its
// kind to "real" with a name, role and a public source link (e.g. a LinkedIn recommendation).
export const recommendations: Recommendation[] = [
  { kind: "placeholder", quote: "Recommendation slot. References available on request." },
  { kind: "placeholder", quote: "Recommendation slot. References available on request." },
  { kind: "placeholder", quote: "Recommendation slot. References available on request." },
];

/** Organisations Jerwin is a member of. Empty until there is a real one with a public source. */
export const affiliations: { name: string; role: string; source: string }[] = [];

/** Sidebar pages that exist only as "coming soon" for now. */
export const soonPages = [
  { slug: "shop", title: "Shop" },
  { slug: "gear", title: "Gear" },
  { slug: "resources", title: "Resources" },
  { slug: "collabs", title: "Collabs" },
  { slug: "consulting", title: "Consulting" },
] as const;
export type SoonSlug = (typeof soonPages)[number]["slug"];

export const sections: Section[] = [
  { id: "blog", title: "blog", more: { label: "All posts", href: "/blog" } },
  { id: "projects", title: "projects", more: { label: "All projects", href: "/resume#work" } },
  { id: "experience", title: "experience", more: { label: "Full history", href: "/resume#experience" } },
  { id: "certifications", title: "certifications", more: { label: "On the résumé", href: "/resume#credentials" } },
  { id: "recommendations", title: "recommendations" },
  { id: "affiliations", title: "affiliations", hidden: affiliations.length === 0 },
  { id: "github", title: "github" },
];
