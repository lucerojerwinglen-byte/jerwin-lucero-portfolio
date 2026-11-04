import type { Project } from "@/types/content";

// Order inside each section is the printed order. `note` and `details` are web-only.
export const projects: Project[] = [
  {
    slug: "lovewin",
    title: "Lovewin",
    description:
      "Free, end-to-end-encrypted digital gifts for long-distance couples; the server only ever stores ciphertext.",
    tags: ["SvelteKit", "Cloudflare Workers", "AES-GCM", "Playwright"],
    liveUrl: "https://lovewin.ottie.workers.dev",
    details:
      "Bouquet builder, letters with a sketch pad, photos (EXIF stripped in the browser), voice memos and songs, an optional code lock and unlock time, all checked by the server. Tested on phone and desktop with Vitest and Playwright. Listed on App Builders PH.",
    note: "The key lives after the # in the link, so even I can’t read your gift.",
    section: "selected",
    year: 2026,
  },
  {
    slug: "barato",
    title: "Barato",
    description:
      "Finds the most filling fast-food order for a budget across six Philippine chains, with a hand-written dynamic-programming solver.",
    tags: ["TypeScript", "React", "offline PWA", "GitHub Actions"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/tipid-hacks",
    liveUrl: "https://barato.pages.dev",
    details:
      "A weekly pipeline fetches, checksums, parses and validates prices (30% price-jump and item-count checks) before anything is published; a failed check opens an issue instead of shipping bad data. Runs at $0/month.",
    note: "Ask me why the combo meal is so often the worst deal.",
    section: "selected",
    year: 2026,
  },
  {
    slug: "team-ops-suite",
    title: "Team Operations Suite",
    description:
      "Eight connected apps for a two-region operations team (case tracking, attendance, scoring, quality audits, forecasting) on one login and database, in production; 58 recorded architecture decisions.",
    tags: ["React", "Hono", "Cloudflare D1", "Playwright"],
    internal: true,
    note: "Built for my own team. No code or screenshots here: it’s my employer’s.",
    section: "selected",
    year: 2026,
  },
  {
    slug: "cpt-excel-to-dashboard",
    title: "CPT Performance Dashboard",
    description:
      "Excel export to team performance view, entirely in the browser; no data leaves the machine.",
    tags: ["TypeScript", "SheetJS"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/cpt-excel-to-dashboard",
    section: "more",
    year: 2026,
  },
  {
    slug: "pet-flap",
    title: "Pet Flap",
    description: "One-tap flying game starring a photo of your own pet, fully on-device.",
    tags: ["TypeScript"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/pet-flap",
    section: "more",
    year: 2026,
  },
  {
    slug: "biasx",
    title: "BiasX",
    context: "undergraduate thesis",
    description:
      "A feature-based framework for explaining and quantifying gender bias in face classification, using Grad-CAM++ and facial landmark detection.",
    tags: ["Python", "explainable AI", "computer vision"],
    section: "research",
    year: 2024,
  },
  {
    slug: "disaster-preparedness-chatbot",
    title: "Disaster-Preparedness ChatBot",
    description:
      "An LLM-powered question-answering system delivering localized disaster-preparedness information to residents.",
    tags: ["Python", "LLMs", "prompt engineering"],
    section: "research",
    year: 2024,
  },
  {
    slug: "filipino-cuisine-association-analysis",
    title: "Filipino Cuisine Ingredient Analysis",
    description:
      "Ethical web scraping, NLP and association analysis to find the ingredients Filipino dishes share.",
    tags: ["Python", "NLP", "data mining"],
    section: "research",
    year: 2024,
  },
  {
    slug: "inventory-management-system",
    title: "Inventory Management System",
    description: "a normalized SQL library-inventory database",
    tags: ["SQL"],
    section: "also",
    year: 2022,
  },
  {
    slug: "revelio",
    title: "Revelio",
    description: "Revelio, a C program that hides text inside bitmap images",
    tags: ["C"],
    section: "also",
    year: 2021,
  },
];
