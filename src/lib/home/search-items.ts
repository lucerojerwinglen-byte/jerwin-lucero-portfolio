// Server-only (reads blog files): everything the Alt+K box can find, for any page that renders <Overlays />.
import { site } from "@/content/data/site";
import { projects } from "@/content/data/projects";
import { numberSections, sectionLabel, sections, soonPages } from "@/content/home/home";
import { getAllPosts } from "@/lib/blog";
import type { SearchItem } from "./search";

/** `home` is the homepage path prefix for section anchors: "" on the homepage, "/" elsewhere. */
export function searchItems(home: "" | "/" = ""): SearchItem[] {
  return [
    ...numberSections(sections).map((s) => ({ title: sectionLabel(s), kind: "section" as const, href: `${home}#${s.id}` })),
    { title: "All projects", kind: "page", href: "/projects", keywords: "apps work research portfolio" },
    { title: "Experience", kind: "page", href: "/experience", keywords: "work jobs stack skills education history" },
    { title: "Certifications", kind: "page", href: "/certifications", keywords: "credentials seminars workshops civil service anthropic claude code subagents agent skills" },
    { title: "Résumé", kind: "page", href: "/resume", keywords: "cv" },
    { title: "Résumé PDF", kind: "file", href: site.resumePdfPath, keywords: "download cv print" },
    { title: "Contact", kind: "section", href: `${home}#hello`, keywords: "email hire message say hello" },
    ...projects.map((p) => ({
      title: p.title,
      kind: "project" as const,
      href: `/projects#${p.slug}`,
      keywords: `${p.description} ${p.tags.join(" ")}`,
    })),
    ...getAllPosts().map((p) => ({ title: p.title, kind: "post" as const, href: `/blog/${p.slug}`, keywords: p.tags.join(" ") })),
    ...soonPages.map((p) => ({ title: p.title, kind: "page" as const, href: `/${p.slug}`, keywords: "coming soon" })),
  ];
}
