import type { SkillGroup } from "@/types/content";

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "Java", "C", "TypeScript", "SQL"],
  },
  {
    category: "Testing & QA",
    items: ["pytest", "Vitest", "Playwright (E2E)", "Unit & Integration Testing", "Manual QA"],
  },
  {
    category: "Web & Frameworks",
    items: ["React", "Next.js", "SvelteKit", "Hono", "Tailwind CSS"],
  },
  {
    category: "Data & Cloud",
    items: ["Cloudflare Workers, D1 & KV", "Supabase", "Drizzle ORM", "GitHub Actions", "Vercel"],
  },
  {
    category: "AI / ML",
    items: ["Prompt Engineering", "Explainable AI", "NLP", "AI-assisted Development"],
  },
  {
    category: "Tools & Platforms",
    items: ["Workday", "HRIS", "Git & GitHub", "WordPress", "Windows OS", "MS Office"],
  },
  {
    category: "General",
    items: [
      "Bilingual (English & Filipino)",
      "Team Collaboration",
      "System Optimization",
      "SLA-driven Operations",
      "Continuous Learning",
    ],
  },
];
