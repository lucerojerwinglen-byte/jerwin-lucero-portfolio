import type { Metadata } from "next";
import { PageShell, ProjectsList } from "@/components/home/PortfolioPages";

export const metadata: Metadata = { title: "Projects", description: "Everything I’ve built: apps, tools and research." };

export default function ProjectsPage() {
  return (
    <PageShell title="Projects" lede="Everything I’ve built so far: shipped apps, team tools and research.">
      <ProjectsList />
    </PageShell>
  );
}
