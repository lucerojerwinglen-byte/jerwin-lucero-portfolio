// Project sheets (ADR 0007): which projects get /projects/<slug>, and what each one shows.
import { projects } from "@/content/data/projects";
import { caseStudies, type CaseStudy } from "@/content/home/case-studies";
import type { Project } from "@/types/content";

export function projectSheetSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function projectSheet(slug: string): { project: Project; caseStudy: CaseStudy | null } | null {
  const project = projects.find((p) => p.slug === slug);
  return project ? { project, caseStudy: caseStudies[slug] ?? null } : null;
}
