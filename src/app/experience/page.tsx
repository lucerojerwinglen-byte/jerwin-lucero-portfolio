import type { Metadata } from "next";
import { ExperienceList, PageShell } from "@/components/home/PortfolioPages";

export const metadata: Metadata = { title: "Experience", description: "Work, stack and education." };

export default function ExperiencePage() {
  return (
    <PageShell title="Experience" lede="Where I’ve worked, what I build with, and where I studied.">
      <ExperienceList />
    </PageShell>
  );
}
