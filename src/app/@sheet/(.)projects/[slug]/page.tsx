// A Project sheet opened by a click inside the site (ADR 0007): intercepts /projects/<slug> and
// shows the same case study over the current page. Cold loads get src/app/projects/[slug] instead.
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/home/ProjectSheet";
import { SheetFrame } from "@/components/home/SheetFrame";
import { projectSheet, projectSheetSlugs } from "@/lib/home/sheets";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectSheetSlugs().map((slug) => ({ slug }));
}

export default async function ProjectSheetModal({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const sheet = projectSheet(slug);
  if (!sheet) notFound();
  return (
    <SheetFrame title={sheet.project.title}>
      <CaseStudy slug={slug} />
    </SheetFrame>
  );
}
