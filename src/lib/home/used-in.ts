import { projects } from "@/content/data/projects";
import { experience } from "@/content/data/experience";
import { skills } from "@/content/data/skills";
import { stackFilterGroups } from "@/content/home/home";

/** A skill's `usedIn` id → a link on the portfolio (a project row or a job row); unknown ids are bugs. */
export function usedInLink(id: string): { label: string; href: string } {
  const p = projects.find((x) => x.slug === id);
  if (p) return { label: p.title, href: `/projects#${p.slug}` };
  const e = experience.find((x) => x.id === id);
  if (e) return { label: e.org, href: `/experience#${e.id}` };
  throw new Error(`usedIn "${id}" matches no project or job`);
}

/** Generic skills (concepts, not tools) stay on /experience, off the homepage tags. */
const isGenericSkill = (n: string) => /testing|manual|engineering|explainable|assisted/i.test(n);

/** The homepage stack filters: one per skills.ts category in stackFilterGroups, generic skills left out. */
export const stackGroups = stackFilterGroups.map((category) => {
  const group = skills.find((g) => g.category === category);
  if (!group) throw new Error(`skills.ts has no "${category}" group`);
  return {
    label: category.replace(" & QA", ""),
    items: group.items.filter((s) => !isGenericSkill(s.name)),
  };
});
