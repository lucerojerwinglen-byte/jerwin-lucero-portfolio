// A Project sheet opened cold (shared link, new tab, crawler): the case study as a full page (ADR 0007).
// Clicks inside the site are intercepted by src/app/@sheet/(.)projects/[slug] and open a sheet instead.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/home/PortfolioPages";
import { CaseStudy } from "@/components/home/ProjectSheet";
import { projectSheet, projectSheetSlugs } from "@/lib/home/sheets";

export const dynamicParams = false; // only real projects; anything else is a 404

export function generateStaticParams() {
  return projectSheetSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const sheet = projectSheet((await params).slug);
  if (!sheet) return {};
  const { title, description } = sheet.project;
  return { title, description, openGraph: { title, description } };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const sheet = projectSheet(slug);
  if (!sheet) notFound();
  return (
    <PageShell title={sheet.project.title} lede={sheet.project.description}>
      <CaseStudy slug={slug} lede={false} />
    </PageShell>
  );
}
