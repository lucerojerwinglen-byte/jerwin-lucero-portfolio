export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  category: "engineering" | "academic";
  year: number;
}

export interface ExperienceItem {
  org: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  level: string;
  school: string;
  period: string;
  detail: string;
}

export interface Credential {
  title: string;
  issuer: string;
  date: string;
  kind: "certification" | "seminar";
  verifyUrl?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}
