/** Where a project sits in the résumé document. */
export type ProjectSection =
  | "selected" // page 1, "Selected work"
  | "more" // page 2, "More work"
  | "research" // page 2, "Research"
  | "also"; // page 2, one "Also built" sentence

export interface Project {
  slug: string;
  title: string;
  /** One or two sentences, as printed. For "also" projects, a phrase that reads inside a sentence. */
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  /** Built for an employer: no code or link can be shown. */
  internal?: boolean;
  /** Small grey qualifier after the title, e.g. "undergraduate thesis". */
  context?: string;
  /** Web-only "Details" expansion; never printed. */
  details?: string;
  /** Web-only pen-blue margin note; never printed. */
  note?: string;
  section: ProjectSection;
  year: number;
}

export interface ExperienceItem {
  /** Stable id: skills point at it as evidence (`data-entry`). */
  id: string;
  org: string;
  role: string;
  period: string;
  location?: string;
  /** Either bullets or a one-line summary. */
  bullets?: string[];
  summary?: string;
  note?: string;
}

export interface EducationItem {
  credential: string;
  school: string;
  period: string;
}

export interface Credential {
  title: string;
  issuer: string;
  /** Short label printed in the left column, e.g. "May 2025". */
  date: string;
  kind: "certification" | "seminar";
  verifyUrl?: string;
  /** A copy of the certificate in public/ (homepage only). */
  pdfPath?: string;
}

export interface Skill {
  name: string;
  /** Entry ids (project slugs or experience ids) that prove this skill. */
  usedIn?: string[];
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}
