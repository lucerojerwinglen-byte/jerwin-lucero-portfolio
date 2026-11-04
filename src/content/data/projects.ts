import type { Project } from "@/types/content";

// NOTE: once this portfolio site itself has a public repo, add it here too.
export const projects: Project[] = [
  {
    slug: "lovewin",
    title: "Lovewin",
    description:
      "Free, end-to-end encrypted digital gifts for long-distance couples — bouquet, letter, photos, voice memo and song, opened from one short link. The AES-GCM key lives after the # in the link, so the server only ever stores ciphertext. Tested on phone and desktop with Vitest and Playwright.",
    tags: ["SvelteKit", "TypeScript", "Cloudflare", "Playwright"],
    liveUrl: "https://lovewin.ottie.workers.dev",
    category: "engineering",
    year: 2026,
  },
  {
    slug: "barato",
    title: "Barato",
    description:
      "Fast-food order optimizer for the Philippines: enter a budget and headcount, and a hand-written two-phase dynamic-programming solver finds the most filling order across six chains. Offline-capable PWA; a weekly GitHub Actions pipeline validates prices before publishing. Runs at $0/month.",
    tags: ["TypeScript", "React", "Algorithms", "GitHub Actions"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/tipid-hacks",
    liveUrl: "https://barato.pages.dev",
    category: "engineering",
    year: 2026,
  },
  {
    slug: "team-ops-suite",
    title: "Team Operations Suite",
    description:
      "Eight connected web apps for a two-region operations team — case tracking, attendance, performance scoring, quality audits and backlog forecasting — on one login and one database, running in production. Built test-first with 58 recorded architecture decisions. Built for an employer, so no code or screenshots here.",
    tags: ["React", "Hono", "Cloudflare D1", "Vitest", "Playwright"],
    internal: true,
    category: "engineering",
    year: 2026,
  },
  {
    slug: "pet-flap",
    title: "Pet Flap",
    description:
      "A one-tap flying game where the character is a photo of your own pet. Runs entirely on-device.",
    tags: ["TypeScript", "Game Dev"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/pet-flap",
    category: "engineering",
    year: 2026,
  },
  {
    slug: "cpt-excel-to-dashboard",
    title: "CPT Performance Dashboard",
    description:
      "Client-side, upload-driven dashboard that turns a raw Excel export into a readable performance view — no backend, no data leaves the browser.",
    tags: ["TypeScript", "Data Visualization"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/cpt-excel-to-dashboard",
    category: "engineering",
    year: 2026,
  },
  {
    slug: "biasx",
    title: "BiasX",
    description:
      "Undergraduate thesis: a feature-based framework for explaining and quantifying gender bias in face classification, using Grad-CAM++ and facial landmark detection.",
    tags: ["Python", "Explainable AI", "Computer Vision"],
    category: "academic",
    year: 2024,
  },
  {
    slug: "disaster-preparedness-chatbot",
    title: "Community-Centric Disaster Preparedness ChatBot AI",
    description:
      "An LLM-powered question-answering system delivering localized disaster preparedness information to residents.",
    tags: ["Python", "LLM", "Prompt Engineering"],
    category: "academic",
    year: 2024,
  },
  {
    slug: "filipino-cuisine-association-analysis",
    title: "Association Analysis of Filipino Cuisine Ingredients",
    description:
      "Data mining research using ethical web scraping, NLP, and association analysis to identify common ingredients across Filipino dishes.",
    tags: ["Python", "NLP", "Data Mining"],
    category: "academic",
    year: 2024,
  },
  {
    slug: "inventory-management-system",
    title: "Inventory Management System",
    description:
      "A designed, optimized, and normalized library database system built with SQL.",
    tags: ["SQL", "Database Design"],
    category: "academic",
    year: 2022,
  },
  {
    slug: "revelio",
    title: "Revelio",
    description:
      "A C program that hides secret text inside bitmap images using steganography, and later retrieves the hidden message by comparing the original and modified images.",
    tags: ["C", "Steganography"],
    category: "academic",
    year: 2021,
  },
];
