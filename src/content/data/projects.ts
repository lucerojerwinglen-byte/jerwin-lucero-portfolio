import type { Project } from "@/types/content";

// NOTE: once this portfolio site itself has a public repo, add it here too.
export const projects: Project[] = [
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
    slug: "tipid-hacks",
    title: "Tipid Hacks",
    description:
      "Budget fast-food order optimizer for the Philippines — finds the most filling combo within a set budget.",
    tags: ["TypeScript"],
    repoUrl: "https://github.com/lucerojerwinglen-byte/tipid-hacks",
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
