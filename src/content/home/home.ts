import { projects } from "@/content/data/projects";
import type { Credential } from "@/types/content";

// Homepage-only content (ADR 0005, 0006). Kept outside src/content/data/ on purpose: that folder
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

/**
 * The hero (ADR 0006, shortened 2026-11-05): Jerwin's own words. Markup is parsed by
 * src/lib/home/hero.ts: {typed title}, [logo pill], *highlighted word*, [A+B+C|stacked logos].
 * Checked by hero.test.ts.
 */
export const hero = {
  paragraphs: [
    "I’m a {software engineer} who loves turning *ideas* into [web] & [mobile] apps, and I’m genuinely excited about [Claude+ChatGPT+Gemini|generative AI].",
    "Always *curious*, always *learning*, always *believing* in what’s next.",
  ],
  caption: "By day: [Workday] Transactions Analyst at Sagility.",
};

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
    href: "/projects#team-ops-suite",
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
    href: "/projects#team-ops-suite",
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

export type FeaturedCard =
  | { kind: "project"; slug: string; icon: { file: string } | { generic: "layers" } }
  | { kind: "placeholder"; title: string; text: string };

/**
 * The fanned cards in 02 projects (ADR 0006). Barato is off the cards but stays in the content
 * layer (résumé, /projects). CPT Tools gets a generic icon: its real icon is the employer's mark.
 */
export const featured: FeaturedCard[] = [
  { kind: "project", slug: "lovewin", icon: { file: "/logos/projects/lovewin.png" } },
  { kind: "project", slug: "team-ops-suite", icon: { generic: "layers" } },
  { kind: "placeholder", title: "Next app", text: "Something new is in the works. Check back soon." },
];

/**
 * Anthropic Education certificates (Skilljar), newest first. Website only: the résumé's credentials
 * list and PDF are unchanged. Each has a verify page and a PDF copy in public/certificates/.
 * Facts come from the verify pages (student, course, issuer "Anthropic Education", completion date);
 * they show no hours or skills, so none are listed.
 */
export const anthropicCerts: Credential[] = [
  { title: "Claude Code in Action", code: "xzr59ivru6vt", file: "certificate-xzr59ivru6vt-1779999271.pdf" },
  { title: "Introduction to agent skills", code: "qou948znnok3", file: "certificate-qou948znnok3-1779913978.pdf" },
  { title: "Introduction to subagents", code: "usrq3bdvoc36", file: "certificate-usrq3bdvoc36-1779889053.pdf" },
  { title: "Claude Code 101", code: "ksn8tc85for4", file: "certificate-ksn8tc85for4-1779745324.pdf" },
].map(({ title, code, file }) => ({
  title,
  issuer: "Anthropic",
  date: "May 2026",
  kind: "certification" as const,
  verifyUrl: `https://verify.skilljar.com/c/${code}`,
  pdfPath: `/certificates/${file}`,
}));

/** Certification issuer → logo file in public/, or null to show initials (no logo source yet). */
export const issuerLogos: Record<string, string | null> = {
  CSC: "/logos/certs/csc.svg",
  "BU College of Science": "/logos/certs/bicol-university.jpg",
  // shortcut: initials until Jerwin supplies the files (no public source could be downloaded).
  // Upgrade: save them under public/logos/certs/, list them in SOURCES.md, set the paths here.
  UNC: null,
  "PROXY by The Oriental": null,
};

/** The issuer's logo file, null for "initials on purpose"; an issuer missing from the map is a bug. */
export function issuerLogo(issuer: string): string | null {
  if (!(issuer in issuerLogos)) throw new Error(`issuerLogos has no entry for "${issuer}" (src/content/home/home.ts)`);
  return issuerLogos[issuer];
}

/**
 * The tools Jerwin works with every day (from his secondbrain vault), shown in the moving strip
 * under the stack and on /experience. Homepage-only on purpose: the résumé's skills list and the
 * PDF stay as they are.
 */
export const toolsIUse = [
  "Claude Code",
  "VS Code",
  "ChatGPT",
  "Gemini",
  "Obsidian",
  "GitHub",
  "Vite",
  "Node.js",
  "Git Bash",
  "PowerShell",
  "Remotion",
  "HyperFrames",
  "ElevenLabs",
] as const;

/** Stack filter groups on the homepage (skills.ts categories); generic skills are left out. */
export const stackFilterGroups = ["Languages", "Testing & QA", "Web", "Data & cloud"] as const;

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
  { id: "projects", title: "projects", more: { label: "All projects", href: "/projects" } },
  { id: "experience", title: "experience", more: { label: "Full history", href: "/experience" } },
  { id: "certifications", title: "certifications", more: { label: "All certifications", href: "/certifications" } },
  { id: "recommendations", title: "recommendations" },
  { id: "affiliations", title: "affiliations", hidden: affiliations.length === 0 },
  { id: "github", title: "github" },
];
