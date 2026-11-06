// Person data (ADR 0007): the schema.org Person on the homepage and the text of /llms.txt.
// Both are built from the content files, so they cannot drift from the page.
import { site } from "@/content/data/site";
import { projects } from "@/content/data/projects";
import { credentials } from "@/content/data/credentials";
import { education } from "@/content/data/education";
import { anthropicCerts } from "@/content/home/home";

/** Homepage identity (ADR 0006): software engineer; the day job is where he works now. */
const jobTitle = "Software Engineer";
const employer = "Sagility";
const dayJob = "Workday Transactions Analyst";
const description =
  "Software engineer in Metro Manila (UTC+8) who builds web and mobile apps with generative AI. By day: Workday Transactions Analyst at Sagility.";

type CredentialLd = {
  "@type": "EducationalOccupationalCredential";
  name: string;
  credentialCategory: string;
  recognizedBy?: { "@type": "Organization"; name: string };
  url?: string;
};

export function personJsonLd() {
  const degree = education[0];
  const org = (name: string) => ({ "@type": "Organization" as const, name });
  // Credentials only: seminars, workshops and summits are attended, not earned (ADR 0007).
  const hasCredential: CredentialLd[] = [
    {
      "@type": "EducationalOccupationalCredential",
      name: degree.credential,
      credentialCategory: "degree",
      recognizedBy: org("Bicol University"),
    },
    ...[...credentials.filter((c) => c.kind === "certification"), ...anthropicCerts].map((c) => ({
      "@type": "EducationalOccupationalCredential" as const,
      name: c.title,
      credentialCategory: "certification",
      recognizedBy: org(c.issuer === "CSC" ? "Civil Service Commission" : c.issuer),
      ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle,
    description,
    worksFor: org(employer),
    hasOccupation: { "@type": "Occupation", name: dayJob },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Bicol University" },
    address: { "@type": "PostalAddress", addressLocality: "Metro Manila", addressCountry: "PH" },
    hasCredential,
    sameAs: [site.social.github],
  };
}

/** /llms.txt (llmstxt.org format). Posts are passed in so this stays a pure function. */
export function llmsText(posts: { slug: string; title: string }[]): string {
  const u = site.url;
  const link = (title: string, path: string, note?: string) => `- [${title}](${u}${path})${note ? `: ${note}` : ""}`;
  return [
    `# ${site.name}`,
    "",
    `> ${description}`,
    "",
    `${jobTitle}. BS Computer Science, Cum Laude (Bicol University). Contact: ${site.email}. Code: ${site.social.github}`,
    "",
    "## Pages",
    "",
    link("Home", "", "portfolio overview"),
    link("Projects", "/projects", "everything built, with links"),
    link("Experience", "/experience", "jobs and the tech stack"),
    link("Certifications", "/certifications", "credentials, with verify links"),
    link("Résumé", "/resume", "two-page résumé, also as a PDF"),
    link("Blog", "/blog"),
    "",
    "## Projects",
    "",
    ...projects.map((p) => link(p.title, `/projects/${p.slug}`, p.description)),
    "",
    "## Posts",
    "",
    ...posts.map((p) => link(p.title, `/blog/${p.slug}`)),
    "",
  ].join("\n");
}
