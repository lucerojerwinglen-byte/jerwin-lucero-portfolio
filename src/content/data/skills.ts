import type { SkillGroup } from "@/types/content";

// `usedIn` powers the web-only "show me the evidence" trace: entry ids are project slugs
// or experience ids. Only list a place that genuinely shows the skill; a skill with no
// entry on the page simply has no trace. Checked by src/lib/document/document.test.ts.
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: [
      { name: "Python", usedIn: ["biasx", "disaster-preparedness-chatbot", "filipino-cuisine-association-analysis"] },
      { name: "TypeScript", usedIn: ["lovewin", "barato", "team-ops-suite", "cpt-excel-to-dashboard", "pet-flap"] },
      { name: "SQL", usedIn: ["team-ops-suite", "inventory-management-system"] },
      { name: "Java" },
      { name: "C", usedIn: ["revelio"] },
    ],
  },
  {
    category: "Testing & QA",
    items: [
      { name: "pytest" },
      { name: "Vitest", usedIn: ["lovewin", "team-ops-suite"] },
      { name: "Playwright (end-to-end)", usedIn: ["lovewin", "team-ops-suite"] },
      { name: "unit & integration testing", usedIn: ["lovewin", "team-ops-suite"] },
      { name: "manual QA", usedIn: ["bu-nlp"] },
    ],
  },
  {
    category: "Web",
    items: [
      { name: "React", usedIn: ["barato", "team-ops-suite"] },
      { name: "Next.js" },
      { name: "SvelteKit", usedIn: ["lovewin"] },
      { name: "Hono", usedIn: ["team-ops-suite"] },
      { name: "Tailwind CSS" },
    ],
  },
  {
    category: "Data & cloud",
    items: [
      { name: "Cloudflare Workers, D1 & KV", usedIn: ["lovewin", "team-ops-suite"] },
      { name: "Supabase" },
      { name: "Drizzle ORM" },
      { name: "GitHub Actions", usedIn: ["barato"] },
      { name: "Vercel" },
    ],
  },
  {
    category: "AI / ML",
    items: [
      { name: "Prompt engineering", usedIn: ["disaster-preparedness-chatbot"] },
      { name: "explainable AI", usedIn: ["biasx"] },
      { name: "NLP", usedIn: ["filipino-cuisine-association-analysis", "bu-nlp"] },
      { name: "AI-assisted development" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Workday (HRIS)", usedIn: ["sagility"] },
      { name: "Git & GitHub" },
      { name: "WordPress", usedIn: ["bu-nlp"] },
      { name: "MS Office" },
    ],
  },
  {
    category: "Spoken",
    items: [{ name: "English" }, { name: "Filipino" }],
  },
];
