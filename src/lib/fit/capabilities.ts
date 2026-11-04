import { projects } from "@/content/data/projects";
import { experience } from "@/content/data/experience";
import { skills } from "@/content/data/skills";
import { credentials } from "@/content/data/credentials";
import { education } from "@/content/data/education";

export type FitStatus = "verified" | "partial" | "gap";

export interface Evidence {
  label: string;
  href: string;
}

export interface Capability {
  id: string;
  /** Recruiter-facing name of the requirement. */
  label: string;
  /** Lowercase phrases a job description might use. Matched as whole words. */
  terms: string[];
  status: FitStatus;
  /** Shown for partial and gap rows: the honest version. */
  note?: string;
  evidence: Evidence[];
}

// Evidence is looked up from the content layer, never typed as free text, so a
// renamed project or skill fails loudly here instead of leaving a stale claim.

function project(slug: string): Evidence {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`fit evidence: unknown project "${slug}"`);
  const href = p.liveUrl ?? p.repoUrl ?? "#projects";
  return { label: p.title, href };
}

function job(org: string, detail: string): Evidence {
  const e = experience.find((x) => x.org.startsWith(org));
  if (!e) throw new Error(`fit evidence: unknown experience "${org}"`);
  return { label: `${detail} · ${org}`, href: "#experience" };
}

function skill(item: string): Evidence {
  if (!skills.some((g) => g.items.includes(item))) {
    throw new Error(`fit evidence: unknown skill "${item}"`);
  }
  return { label: `Stack: ${item}`, href: "#skills" };
}

function credential(titleStart: string): Evidence {
  const c = credentials.find((x) => x.title.startsWith(titleStart));
  if (!c) throw new Error(`fit evidence: unknown credential "${titleStart}"`);
  return { label: c.title, href: "#credentials" };
}

function degree(): Evidence {
  const d = education.find((x) => x.level === "Tertiary");
  if (!d) throw new Error("fit evidence: no tertiary education entry");
  return { label: d.detail, href: "#experience" };
}

export const capabilities: Capability[] = [
  // ── Testing & QA ──────────────────────────────────────────
  {
    id: "manual-qa",
    label: "Manual QA & testing",
    terms: ["quality assurance", "qa", "manual testing", "test cases", "test case", "exploratory testing", "regression testing", "bug reports", "bug reporting", "defects", "software testing", "qa testing"],
    status: "verified",
    evidence: [job("Bicol University", "QA for the BOSESKO app"), skill("Manual QA")],
  },
  {
    id: "pytest",
    label: "pytest",
    terms: ["pytest"],
    status: "verified",
    evidence: [skill("pytest")],
  },
  {
    id: "automated-testing",
    label: "Automated, unit & integration tests",
    terms: ["automated testing", "test automation", "unit testing", "unit tests", "integration testing", "integration tests", "tdd", "test-driven", "vitest", "jest"],
    status: "verified",
    evidence: [project("team-ops-suite"), skill("Vitest"), skill("Unit & Integration Testing")],
  },
  {
    id: "e2e",
    label: "End-to-end browser tests (Playwright)",
    terms: ["playwright", "end to end", "e2e"],
    status: "verified",
    evidence: [project("lovewin"), skill("Playwright (E2E)")],
  },
  {
    id: "browser-automation-legacy",
    label: "Selenium / Cypress",
    terms: ["selenium", "cypress", "webdriver"],
    status: "partial",
    note: "Browser automation done in Playwright; not Selenium or Cypress yet.",
    evidence: [skill("Playwright (E2E)")],
  },
  {
    id: "postman",
    label: "Postman",
    terms: ["postman"],
    status: "gap",
    note: "APIs tested in code (Vitest), not with Postman.",
    evidence: [],
  },
  {
    id: "istqb",
    label: "ISTQB certification",
    terms: ["istqb"],
    status: "gap",
    note: "Not certified yet.",
    evidence: [],
  },

  // ── Languages ─────────────────────────────────────────────
  {
    id: "python",
    label: "Python",
    terms: ["python"],
    status: "verified",
    evidence: [project("biasx"), project("filipino-cuisine-association-analysis")],
  },
  {
    id: "sql",
    label: "SQL & databases",
    terms: ["sql", "mysql", "postgresql", "postgres", "sqlite", "sql server", "database", "databases", "relational database"],
    status: "verified",
    evidence: [project("inventory-management-system"), project("team-ops-suite")],
  },
  {
    id: "typescript",
    label: "TypeScript / JavaScript",
    terms: ["typescript", "javascript", "js", "ts"],
    status: "verified",
    evidence: [project("lovewin"), project("barato"), project("cpt-excel-to-dashboard")],
  },
  {
    id: "java",
    label: "Java",
    terms: ["java"],
    status: "verified",
    evidence: [skill("Java")],
  },
  {
    id: "c-lang",
    label: "C",
    terms: ["c programming", "c language", "c/c++"],
    status: "verified",
    evidence: [project("revelio")],
  },
  {
    id: "web",
    label: "Web development (HTML, CSS, React)",
    terms: ["html", "css", "react", "next.js", "nextjs", "svelte", "sveltekit", "tailwind", "front-end", "frontend", "web development", "web applications", "web apps"],
    status: "verified",
    evidence: [project("lovewin"), project("barato"), skill("Next.js")],
  },
  {
    id: "apis",
    label: "REST APIs",
    terms: ["rest api", "rest apis", "api", "apis", "backend", "back-end"],
    status: "verified",
    evidence: [project("team-ops-suite"), skill("Hono")],
  },

  // ── Data ──────────────────────────────────────────────────
  {
    id: "data-analysis",
    label: "Data analysis",
    terms: ["data analysis", "data analytics", "analyze data", "analyse data", "data mining", "analytical skills", "analytical"],
    status: "verified",
    evidence: [project("filipino-cuisine-association-analysis"), project("cpt-excel-to-dashboard")],
  },
  {
    id: "excel",
    label: "Excel & spreadsheets",
    terms: ["excel", "spreadsheet", "spreadsheets", "google sheets", "ms office", "microsoft office"],
    status: "verified",
    evidence: [project("cpt-excel-to-dashboard"), skill("MS Office")],
  },
  {
    id: "dataviz",
    label: "Dashboards & data visualization",
    terms: ["data visualization", "dashboard", "dashboards", "report generation", "charts"],
    status: "verified",
    evidence: [project("cpt-excel-to-dashboard"), project("team-ops-suite")],
  },
  {
    id: "bi-tools",
    label: "Power BI / Tableau",
    terms: ["power bi", "tableau", "looker"],
    status: "partial",
    note: "Builds dashboards in code; hasn't shipped one in Power BI or Tableau yet.",
    evidence: [project("cpt-excel-to-dashboard")],
  },
  {
    id: "data-quality",
    label: "Data validation & integrity",
    terms: ["data validation", "data quality", "data integrity", "data accuracy", "data entry", "attention to detail", "detail-oriented", "detail oriented"],
    status: "verified",
    evidence: [job("Sagility", "Validates every HR transaction before processing"), project("barato")],
  },
  {
    id: "pipelines",
    label: "Data pipelines, ETL & scraping",
    terms: ["etl", "data pipeline", "data pipelines", "web scraping", "data collection", "data cleaning"],
    status: "verified",
    evidence: [project("barato"), project("filipino-cuisine-association-analysis")],
  },
  {
    id: "pandas",
    label: "pandas / NumPy",
    terms: ["pandas", "numpy"],
    status: "partial",
    note: "Ported a pandas transform to the browser; no standalone pandas project shown here.",
    evidence: [project("cpt-excel-to-dashboard")],
  },
  {
    id: "statistics",
    label: "Statistics",
    terms: ["statistics", "statistical", "hypothesis testing"],
    status: "partial",
    note: "Applied in research (bias quantification, association rules), not formal coursework shown.",
    evidence: [project("biasx"), project("filipino-cuisine-association-analysis")],
  },

  // ── AI / ML ───────────────────────────────────────────────
  {
    id: "ml",
    label: "Machine learning & computer vision",
    terms: ["machine learning", "ml", "deep learning", "computer vision", "explainable ai", "xai", "model evaluation", "model fairness"],
    status: "verified",
    evidence: [project("biasx"), skill("Explainable AI")],
  },
  {
    id: "llm",
    label: "LLMs, generative AI & prompt engineering",
    terms: ["llm", "llms", "large language models", "generative ai", "genai", "prompt engineering", "chatgpt", "ai tools", "artificial intelligence"],
    status: "verified",
    evidence: [project("disaster-preparedness-chatbot"), credential("AI.Deas"), skill("AI-assisted Development")],
  },
  {
    id: "nlp",
    label: "Natural language processing",
    terms: ["nlp", "natural language processing", "text mining"],
    status: "verified",
    evidence: [project("filipino-cuisine-association-analysis"), job("Bicol University", "BU NLP research lab")],
  },
  {
    id: "research",
    label: "Research",
    terms: ["research", "literature review", "experiments", "experimentation"],
    status: "verified",
    evidence: [project("biasx"), credential("NurTURe")],
  },
  {
    id: "ml-frameworks",
    label: "TensorFlow / PyTorch",
    terms: ["tensorflow", "pytorch", "keras", "scikit-learn", "sklearn"],
    status: "partial",
    note: "Used ML tooling in thesis work; framework-specific depth not shown here.",
    evidence: [project("biasx")],
  },

  // ── Engineering practice & tooling ───────────────────────
  {
    id: "git",
    label: "Git & GitHub",
    terms: ["git", "github", "version control", "gitlab"],
    status: "verified",
    evidence: [credential("Get Your Git Together"), skill("Git & GitHub")],
  },
  {
    id: "ci",
    label: "CI/CD",
    terms: ["ci/cd", "continuous integration", "github actions", "deployment"],
    status: "verified",
    evidence: [project("barato"), skill("GitHub Actions")],
  },
  {
    id: "cloud",
    label: "Cloud platforms",
    terms: ["cloud", "aws", "azure", "gcp", "google cloud"],
    status: "partial",
    note: "Ships on Cloudflare and Vercel; no AWS, Azure or GCP experience yet.",
    evidence: [skill("Cloudflare Workers, D1 & KV"), skill("Vercel")],
  },
  {
    id: "containers",
    label: "Docker / Kubernetes",
    terms: ["docker", "kubernetes", "containers"],
    status: "gap",
    note: "Not yet.",
    evidence: [],
  },
  {
    id: "agile",
    label: "Agile / Scrum",
    terms: ["agile", "scrum", "sprint", "sprints", "kanban"],
    status: "partial",
    note: "Works in small tickets with PR review; no formal Scrum team yet.",
    evidence: [project("team-ops-suite")],
  },
  {
    id: "jira",
    label: "Jira",
    terms: ["jira", "confluence"],
    status: "gap",
    note: "Uses GitHub Issues instead.",
    evidence: [],
  },
  {
    id: "documentation",
    label: "Documentation",
    terms: ["documentation", "technical writing", "test plans", "test plan"],
    status: "verified",
    evidence: [project("team-ops-suite"), job("Sagility", "Keeps complete audit-ready transaction logs")],
  },
  {
    id: "problem-solving",
    label: "Problem solving & optimization",
    terms: ["problem solving", "problem-solving", "troubleshooting", "debugging", "optimization", "algorithms"],
    status: "verified",
    evidence: [project("barato"), skill("System Optimization")],
  },
  {
    id: "security",
    label: "Security & privacy",
    terms: ["security", "encryption", "data privacy", "privacy", "confidentiality"],
    status: "verified",
    evidence: [project("lovewin"), job("Sagility", "Upholds data confidentiality")],
  },
  {
    id: "wordpress",
    label: "WordPress",
    terms: ["wordpress", "cms"],
    status: "verified",
    evidence: [job("Bicol University", "Co-built the e-Participation 2.0 site")],
  },

  // ── Operations & domain ──────────────────────────────────
  {
    id: "workday",
    label: "Workday / HRIS",
    terms: ["workday", "hris", "hr systems", "human resources", "hr", "erp"],
    status: "verified",
    evidence: [job("Sagility", "Workday Transactions Analyst")],
  },
  {
    id: "audit",
    label: "Audit, compliance & process",
    terms: ["audit", "audits", "compliance", "process improvement", "sop", "sops", "controls"],
    status: "verified",
    evidence: [job("Sagility", "Supports quality checks and process audits"), project("team-ops-suite")],
  },
  {
    id: "sla",
    label: "SLAs & high-volume work",
    terms: ["sla", "slas", "deadlines", "fast-paced", "fast paced", "high-volume", "high volume", "kpi", "kpis"],
    status: "verified",
    evidence: [job("Sagility", "SLA-driven transaction queue"), skill("SLA-driven Operations")],
  },
  {
    id: "communication",
    label: "Communication (English & Filipino)",
    terms: ["communication", "communication skills", "english", "filipino", "tagalog", "written and verbal", "stakeholders", "stakeholder"],
    status: "verified",
    evidence: [skill("Bilingual (English & Filipino)"), job("Sagility", "Escalates issues to leads and SMEs")],
  },
  {
    id: "teamwork",
    label: "Teamwork & collaboration",
    terms: ["teamwork", "team player", "collaboration", "collaborate", "cross-functional"],
    status: "verified",
    evidence: [job("Bicol University", "Co-developed a research-lab website"), skill("Team Collaboration")],
  },
  {
    id: "degree",
    label: "Bachelor's in Computer Science / IT",
    terms: ["bachelor", "bachelor's", "bachelors", "degree", "computer science", "information technology", "related field"],
    status: "verified",
    evidence: [degree()],
  },
  {
    id: "civil-service",
    label: "Civil Service eligibility",
    terms: ["civil service"],
    status: "verified",
    evidence: [credential("Civil Service Exam")],
  },
];
